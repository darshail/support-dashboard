import Papa from 'papaparse'

/**
 * Parse a CSV file with PapaParse.
 * @param {File} file
 * @returns {Promise<{ data: object[], errors: object[], meta: object }>}
 */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results),
      error: (error) => reject(error),
    })
  })
}
