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
      console.log('Original JSON string:', jsonStr);

      // Strategy 1: Try a completely custom parser for Python-dict-like format
      try {
        const result: Record<string, string> = {};

        // Remove outer braces and split by top-level commas
        const content = jsonStr.replace(/^{|}$/g, '').trim();

        // Split on commas that are followed by a space and single quote (key boundary)
        // This regex looks for: , 'key': pattern
        const parts = content.split(/,\s*(?='[^']+':)/);

        for (const part of parts) {
          const colonIndex = part.indexOf(':');
          if (colonIndex > 0) {
            // Extract key
            let key = part.substring(0, colonIndex).trim();
            key = key.replace(/^'|'$/g, ''); // Remove surrounding single quotes

            // Extract value
            let value = part.substring(colonIndex + 1).trim();

            // Handle different value formats
            if (value.startsWith("'") && value.endsWith("'")) {
              // Single-quoted value
              value = value.slice(1, -1);
            } else if (value.startsWith('"') && value.endsWith('"')) {
              // Double-quoted value
              value = value.slice(1, -1);
            } else if (value.startsWith("'") && !value.endsWith("'")) {
              // Incomplete single-quoted value (truncated)
              value = value.slice(1);
            }

            // Handle escaped characters
            value = value.replace(/\\'/g, "'").replace(/\\n/g, '\n');

            result[key] = value;
          }
        }

        // console.log('Successfully parsed with custom parser:', result);
        return result;
      } catch {
        // console.log('Custom parser failed, trying JSON conversion');

        // Strategy 2: JSON conversion approach
        // Convert single-quoted keys to double-quoted keys
        jsonStr = jsonStr.replace(/'([^']+)':/g, '"$1":');

        // Convert single-quoted values to double-quoted values, handling escapes
        jsonStr = jsonStr.replace(/\\'/g, 'ESCAPED_SINGLE_QUOTE'); // Temporarily replace escaped quotes
        jsonStr = jsonStr.replace(/:\s*'([^']*)'/g, ': "$1"');
        jsonStr = jsonStr.replace(/ESCAPED_SINGLE_QUOTE/g, "'"); // Restore escaped quotes

        // Handle escaped double quotes
        jsonStr = jsonStr.replace(/\\"/g, '"');

        // Fix truncation issues
        jsonStr = jsonStr.replace(/,\s*$/, ''); // Remove trailing comma
        if (!jsonStr.trim().endsWith('}')) {
          jsonStr += '}';
        }

        // console.log('After JSON conversion:', jsonStr);

        const parsed = JSON.parse(jsonStr);
        // console.log('Successfully parsed with JSON conversion:', parsed);
        return parsed;
      }
    } catch (parseError) {
      // console.log('Initial JSON parse failed:', parseError);
      return {
        error: 'Failed to parse log summary: ' + String(parseError),
      };
    }
  } catch (error) {
    // console.error('Error parsing log summary:', error);
    return {
      error:
        'Failed to parse log summary: ' +
        (error instanceof Error ? error.message : String(error)),
    };
  }
};
