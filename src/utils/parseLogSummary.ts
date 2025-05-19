/**
 * Parses a log summary string into a structured object
 * @param summaryString The log summary string to parse
 * @returns A parsed object with log file names as keys and their content as values
 */
export const parseLogSummary = (
  summaryString: string
): Record<string, string> => {
  try {
    // Extract the JSON part from the string
    const match = summaryString.match(/Log Summary: (.*)/);
    if (!match || !match[1]) {
      return { error: 'Could not parse log summary' };
    }

    let jsonStr = match[1];

    // Check if we have a raw log entry as input (from the second dialog)
    if (
      summaryString.startsWith('"*') &&
      summaryString.includes('this is the value for the key')
    ) {
      // Extract which log file this content belongs to
      const keyMatch = summaryString.match(/value for the key (\S+\.log)/);
      const key = keyMatch ? keyMatch[1] : 'log.log';

      // Extract the actual log content
      const contentMatch = summaryString.match(/^"(.+?)"\s+'this is/);
      const content = contentMatch
        ? contentMatch[1].replace(/\\n/g, '\n')
        : summaryString;

      // Return a structured object with this single log entry
      return { [key]: content };
    }

    // Handle common JSON parsing issues
    try {
      // Convert single quotes to double quotes for valid JSON
      jsonStr = jsonStr.replace(/'/g, '"');

      // Try to parse as is first
      const parsed = JSON.parse(jsonStr);

      // Process parsed content to handle escaped newlines
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === 'string') {
          // Replace escaped newlines with actual newlines
          parsed[key] = parsed[key].replace(/\\n/g, '\n');

          // Mark truncated content
          if (parsed[key].endsWith('...') || parsed[key].endsWith('…')) {
            parsed[key] = parsed[key] + ' [Content truncated]';
          }
        }
      });

      return parsed;
    } catch (parseError) {
      console.log('Initial JSON parse failed, attempting cleanup:', parseError);

      // Manual parsing approach
      const result: Record<string, string> = {};

      // Use regex to find each key-value pair in format "key": "value"
      // This handles cases where values might be truncated or contain nested quotes
      const keyValueRegex = /"([^"]+)":\s*"((?:\\"|[^"])*?)(?:"|$)/g;
      let regexMatch;

      while ((regexMatch = keyValueRegex.exec(jsonStr)) !== null) {
        const [, key, value] = regexMatch;
        if (key) {
          // Replace escaped newlines
          result[key] = value.replace(/\\n/g, '\n');
        }
      }

      // If we couldn't extract any data with the regex, return an error
      if (Object.keys(result).length === 0) {
        // Try a more manual approach by splitting on commas, helpful for malformed JSON
        const pairs = jsonStr.replace(/[{}]/g, '').split(/,(?="\w)/);
        for (const pair of pairs) {
          const colonIndex = pair.indexOf(':');
          if (colonIndex > 0) {
            let key = pair.substring(0, colonIndex).trim();
            let value = pair.substring(colonIndex + 1).trim();

            // Remove quotes if they exist
            key = key.replace(/^"|"$/g, '');

            // Handle value quotes more carefully
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            } else if (value.startsWith('"')) {
              value = value.substring(1);
            }

            // Replace escaped newlines
            value = value.replace(/\\n/g, '\n');

            result[key] = value;
          }
        }

        if (Object.keys(result).length === 0) {
          return {
            error: 'Failed to parse malformed JSON: ' + String(parseError),
          };
        }
      }

      return result;
    }
  } catch (error) {
    console.error('Error parsing log summary:', error);
    return {
      error:
        'Failed to parse log summary: ' +
        (error instanceof Error ? error.message : String(error)),
    };
  }
};
