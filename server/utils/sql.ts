/**
 * Escape the SQL LIKE wildcard characters in user input, so that
 * '%' and '_' in a product name are matched literally.
 * '*' and '?' are the user friendly wildcards.
 */
export function toLikePattern(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
    .replace(/\*/g, '%')
    .replace(/\?/g, '_')
}
