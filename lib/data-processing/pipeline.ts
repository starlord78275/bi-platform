export interface Dataset {
  raw: Record<string, any>[]
  numericColumns: string[]
  cleaned: Record<string, number>[]
  stats: {
    rows: number
    columns: number
    sample: Record<string, any>[]
    missing: Record<string, number>
    summary: Record<string, { min: number; max: number; mean: number; median: number }>
  }
}

// Clean data - remove nulls, convert to numbers
function cleanNumericData(
  rawData: Record<string, any>[],
  numericColumns: string[]
): Record<string, number>[] {
  return rawData
    .map(row => {
      const cleanedRow: Record<string, number> = {}
      numericColumns.forEach(col => {
        const val = row[col]
        cleanedRow[col] = val === null || val === '' ? NaN : Number(val)
      })
      return cleanedRow
    })
    .filter(row => Object.values(row).some(v => !isNaN(v)))
}

// Calculate column statistics
function calculateStats(
  cleaned: Record<string, number>[],
  numericColumns: string[]
): Record<string, { min: number; max: number; mean: number; median: number }> {
  const summary: Record<string, any> = {}
  
  numericColumns.forEach(col => {
    const values = cleaned.map(row => row[col]).filter(v => !isNaN(v))
    if (values.length === 0) return
    
    values.sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    
    summary[col] = {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: sum / values.length,
      median: values[Math.floor(values.length / 2)]
    }
  })
  
  return summary
}

// Count missing values per column
function countMissing(
  rawData: Record<string, any>[],
  numericColumns: string[]
): Record<string, number> {
  const missing: Record<string, number> = {}
  
  numericColumns.forEach(col => {
    missing[col] = rawData.filter(row => 
      row[col] === null || row[col] === '' || row[col] === undefined
    ).length
  })
  
  return missing
}

export function analyzeDataset(rawData: Record<string, any>[]): Dataset {
  if (rawData.length === 0) {
    return { 
      raw: [], 
      numericColumns: [], 
      cleaned: [], 
      stats: { rows: 0, columns: 0, sample: [], missing: {}, summary: {} } 
    }
  }

  // 1. Detect numeric columns
  const numericColumns = Object.keys(rawData[0]).filter(col =>
    rawData.every(row => {
      const val = row[col]
      return val === null || val === '' || !isNaN(Number(val))
    })
  )

  // 2. Clean data
  const cleaned = cleanNumericData(rawData, numericColumns)

  // 3. Calculate stats
  const missing = countMissing(rawData, numericColumns)
  const summary = calculateStats(cleaned, numericColumns)

  return {
    raw: rawData,
    numericColumns,
    cleaned,
    stats: {
      rows: cleaned.length,
      columns: numericColumns.length,
      sample: cleaned.slice(0, 5),
      missing,
      summary
    }
  }
}

// Export for charts
export function prepareChartData(
  dataset: Dataset,
  xColumn: string,
  yColumn: string
): Array<{ x: number; y: number }> {
  return dataset.cleaned
    .filter(row => !isNaN(row[xColumn]) && !isNaN(row[yColumn]))
    .map(row => ({ x: row[xColumn], y: row[yColumn] }))
}
