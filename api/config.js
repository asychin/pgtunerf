// Vercel Serverless Function: /api/config
// Usage: curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=conf"
// format=conf (default) -> postgresql.conf format
// format=alter -> ALTER SYSTEM format

const SIZE_UNIT_MAP = {
  KB: 1024,
  MB: 1048576,
  GB: 1073741824,
  TB: 1099511627776
}

const DB_TYPE_WEB = 'web'
const DB_TYPE_OLTP = 'oltp'
const DB_TYPE_DW = 'dw'
const DB_TYPE_DESKTOP = 'desktop'
const DB_TYPE_MIXED = 'mixed'
const OS_LINUX = 'linux'
const OS_WINDOWS = 'windows'
const HARD_DRIVE_HDD = 'hdd'
const HARD_DRIVE_SSD = 'ssd'
const HARD_DRIVE_SAN = 'san'

const VALID_DB_TYPES = [DB_TYPE_WEB, DB_TYPE_OLTP, DB_TYPE_DW, DB_TYPE_DESKTOP, DB_TYPE_MIXED]
const VALID_OS_TYPES = [OS_LINUX, OS_WINDOWS, 'mac']
const VALID_HD_TYPES = [HARD_DRIVE_HDD, HARD_DRIVE_SSD, HARD_DRIVE_SAN]
const VALID_MEMORY_UNITS = ['MB', 'GB']

function formatValue(valueKb) {
  if (valueKb % (SIZE_UNIT_MAP['GB'] / SIZE_UNIT_MAP['KB']) === 0) {
    return `${Math.floor(valueKb / (SIZE_UNIT_MAP['GB'] / SIZE_UNIT_MAP['KB']))}GB`
  }
  if (valueKb % (SIZE_UNIT_MAP['MB'] / SIZE_UNIT_MAP['KB']) === 0) {
    return `${Math.floor(valueKb / (SIZE_UNIT_MAP['MB'] / SIZE_UNIT_MAP['KB']))}MB`
  }
  return `${valueKb}kB`
}

function calculate(params) {
  const { dbVersion, osType, dbType, totalMemory, totalMemoryUnit, cpuNum, connectionNum, hdType } =
    params

  const totalMemoryBytes = totalMemory * SIZE_UNIT_MAP[totalMemoryUnit]
  const totalMemoryKb = totalMemoryBytes / SIZE_UNIT_MAP['KB']

  // max_connections
  const maxConnections = connectionNum
    ? connectionNum
    : {
        [DB_TYPE_WEB]: 200,
        [DB_TYPE_OLTP]: 300,
        [DB_TYPE_DW]: 40,
        [DB_TYPE_DESKTOP]: 20,
        [DB_TYPE_MIXED]: 100
      }[dbType]

  // huge_pages - based on shared_buffers, not total memory
  // (will be set after shared_buffers calculation)

  // shared_buffers
  // For servers with >64GB RAM, use up to 40% for OLTP/DW/Mixed workloads
  const totalMemoryGB = totalMemoryKb / (SIZE_UNIT_MAP['GB'] / SIZE_UNIT_MAP['KB'])
  const isLargeMemory = totalMemoryGB > 64

  let sharedBuffers
  if (isLargeMemory) {
    sharedBuffers = {
      [DB_TYPE_WEB]: Math.floor(totalMemoryKb / 4),
      [DB_TYPE_OLTP]: Math.floor(Math.floor((totalMemoryKb * 2) / 5) / 1024) * 1024,
      [DB_TYPE_DW]: Math.floor(Math.floor((totalMemoryKb * 2) / 5) / 1024) * 1024,
      [DB_TYPE_DESKTOP]: Math.floor(totalMemoryKb / 16),
      [DB_TYPE_MIXED]: Math.floor(Math.floor((totalMemoryKb * 2) / 5) / 1024) * 1024
    }[dbType]
  } else {
    sharedBuffers = {
      [DB_TYPE_WEB]: Math.floor(totalMemoryKb / 4),
      [DB_TYPE_OLTP]: Math.floor(totalMemoryKb / 4),
      [DB_TYPE_DW]: Math.floor(totalMemoryKb / 4),
      [DB_TYPE_DESKTOP]: Math.floor(totalMemoryKb / 16),
      [DB_TYPE_MIXED]: Math.floor(totalMemoryKb / 4)
    }[dbType]
  }
  if (dbVersion < 10 && osType === OS_WINDOWS) {
    const winMemoryLimit = (512 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB']
    if (sharedBuffers > winMemoryLimit) {
      sharedBuffers = winMemoryLimit
    }
  }

  // huge_pages - enable when shared_buffers >= 8GB
  const hugePages = sharedBuffers >= 8388608 ? 'try' : 'off'

  // effective_cache_size
  const effectiveCacheSize = {
    [DB_TYPE_WEB]: Math.floor((totalMemoryKb * 3) / 4),
    [DB_TYPE_OLTP]: Math.floor((totalMemoryKb * 3) / 4),
    [DB_TYPE_DW]: Math.floor((totalMemoryKb * 3) / 4),
    [DB_TYPE_DESKTOP]: Math.floor(totalMemoryKb / 4),
    [DB_TYPE_MIXED]: Math.floor((totalMemoryKb * 3) / 4)
  }[dbType]

  // maintenance_work_mem
  let maintenanceWorkMem = {
    [DB_TYPE_WEB]: Math.floor(totalMemoryKb / 16),
    [DB_TYPE_OLTP]: Math.floor(totalMemoryKb / 16),
    [DB_TYPE_DW]: Math.floor(totalMemoryKb / 8),
    [DB_TYPE_DESKTOP]: Math.floor(totalMemoryKb / 16),
    [DB_TYPE_MIXED]: Math.floor(totalMemoryKb / 16)
  }[dbType]
  const memoryLimit = (2 * SIZE_UNIT_MAP['GB']) / SIZE_UNIT_MAP['KB']
  if (maintenanceWorkMem >= memoryLimit) {
    if (osType === OS_WINDOWS) {
      maintenanceWorkMem = memoryLimit - (1 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB']
    } else {
      maintenanceWorkMem = memoryLimit
    }
  }

  // checkpoint_completion_target
  const checkpointCompletionTarget = 0.9

  // checkpoint segments (min/max wal size)
  const checkpointSegments = [
    {
      key: 'min_wal_size',
      value: {
        [DB_TYPE_WEB]: (1024 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_OLTP]: (2048 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_DW]: (4096 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_DESKTOP]: (100 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_MIXED]: (1024 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB']
      }[dbType]
    },
    {
      key: 'max_wal_size',
      value: {
        [DB_TYPE_WEB]: (4096 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_OLTP]: (8192 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_DW]: (16384 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_DESKTOP]: (2048 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB'],
        [DB_TYPE_MIXED]: (4096 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB']
      }[dbType]
    }
  ]

  // wal_buffers
  let walBuffers = Math.floor((3 * sharedBuffers) / 100)
  const maxWalBuffer = (16 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB']
  if (walBuffers > maxWalBuffer) walBuffers = maxWalBuffer
  const walBufferNearValue = (14 * SIZE_UNIT_MAP['MB']) / SIZE_UNIT_MAP['KB']
  if (walBuffers > walBufferNearValue && walBuffers < maxWalBuffer) walBuffers = maxWalBuffer
  if (walBuffers < 32) walBuffers = 32

  // default_statistics_target
  const defaultStatisticsTarget = {
    [DB_TYPE_WEB]: 100,
    [DB_TYPE_OLTP]: 100,
    [DB_TYPE_DW]: 500,
    [DB_TYPE_DESKTOP]: 100,
    [DB_TYPE_MIXED]: 100
  }[dbType]

  // random_page_cost
  const randomPageCost = {
    [HARD_DRIVE_HDD]: 4,
    [HARD_DRIVE_SSD]: 1.1,
    [HARD_DRIVE_SAN]: 1.1
  }[hdType]

  // effective_io_concurrency
  // Windows supports effective_io_concurrency starting from PostgreSQL 13
  let effectiveIoConcurrency = null
  if (osType === OS_LINUX || (osType === OS_WINDOWS && dbVersion >= 13)) {
    effectiveIoConcurrency = {
      [HARD_DRIVE_HDD]: 2,
      [HARD_DRIVE_SSD]: 200,
      [HARD_DRIVE_SAN]: 300
    }[hdType]
  }

  // parallel settings
  let parallelSettings = []
  if (cpuNum && cpuNum >= 4) {
    let workersPerGather = Math.ceil(cpuNum / 2)
    if (dbType !== DB_TYPE_DW && workersPerGather > 4) workersPerGather = 4

    parallelSettings.push(
      { key: 'max_worker_processes', value: cpuNum },
      { key: 'max_parallel_workers_per_gather', value: workersPerGather }
    )
    if (dbVersion >= 10) {
      parallelSettings.push({ key: 'max_parallel_workers', value: cpuNum })
    }
    if (dbVersion >= 11) {
      let parallelMaintenanceWorkers = Math.ceil(cpuNum / 2)
      if (parallelMaintenanceWorkers > 4) parallelMaintenanceWorkers = 4
      parallelSettings.push({
        key: 'max_parallel_maintenance_workers',
        value: parallelMaintenanceWorkers
      })
    }
  }

  // work_mem
  // Use max_parallel_workers_per_gather for per-query parallelism
  const defaultWorkersPerGather = 2
  let parallelForWorkMem = defaultWorkersPerGather
  if (parallelSettings.length) {
    const wpg = parallelSettings.find((p) => p.key === 'max_parallel_workers_per_gather')
    if (wpg && wpg.value > 0) parallelForWorkMem = wpg.value
  }
  const workMemValue = (totalMemoryKb - sharedBuffers) / ((maxConnections + parallelForWorkMem) * 3)
  let workMem = {
    [DB_TYPE_WEB]: Math.floor(workMemValue),
    [DB_TYPE_OLTP]: Math.floor(workMemValue),
    [DB_TYPE_DW]: Math.floor(workMemValue / 2),
    [DB_TYPE_DESKTOP]: Math.floor(workMemValue / 6),
    [DB_TYPE_MIXED]: Math.floor(workMemValue / 2)
  }[dbType]
  if (workMem < 64) workMem = 64

  // wal_level
  const walLevel =
    dbType === DB_TYPE_DESKTOP
      ? [
          { key: 'wal_level', value: 'minimal' },
          { key: 'max_wal_senders', value: '0' }
        ]
      : []

  // warnings
  const warnings = []
  if (totalMemoryBytes < 256 * SIZE_UNIT_MAP['MB']) {
    warnings.push('WARNING', 'this tool not being optimal', 'for low memory systems')
  }

  return {
    maxConnections,
    hugePages,
    sharedBuffers,
    effectiveCacheSize,
    maintenanceWorkMem,
    checkpointCompletionTarget,
    checkpointSegments,
    walBuffers,
    defaultStatisticsTarget,
    randomPageCost,
    effectiveIoConcurrency,
    parallelSettings,
    workMem,
    walLevel,
    warnings
  }
}

function generateOutput(params, config, isAlterSystem) {
  const comment = isAlterSystem ? '--' : '#'

  // hardware info header
  const hwLines = [
    ['Версия БД', params.dbVersion],
    ['Тип ОС', params.osType],
    ['Тип БД', params.dbType],
    ['Оперативная память (RAM)', `${params.totalMemory} ${params.totalMemoryUnit}`],
    ['Кол-во CPU', params.cpuNum],
    ['Кол-во соединений', params.connectionNum],
    ['Хранилище данных', params.hdType]
  ]
    .filter(([, v]) => !!v)
    .map(([k, v]) => `${comment} ${k}: ${v}`)

  hwLines.push(`${comment} Настроено с помощью пгтюн.рф`)

  // config values
  const configEntries = [
    ['max_connections', config.maxConnections],
    ['shared_buffers', formatValue(config.sharedBuffers)],
    ['effective_cache_size', formatValue(config.effectiveCacheSize)],
    ['maintenance_work_mem', formatValue(config.maintenanceWorkMem)],
    ['checkpoint_completion_target', config.checkpointCompletionTarget],
    ['wal_buffers', formatValue(config.walBuffers)],
    ['default_statistics_target', config.defaultStatisticsTarget],
    ['random_page_cost', config.randomPageCost],
    ['effective_io_concurrency', config.effectiveIoConcurrency],
    ['work_mem', formatValue(config.workMem)],
    ['huge_pages', config.hugePages]
  ]

  config.checkpointSegments.forEach((s) => {
    if (s.key === 'checkpoint_segments') {
      configEntries.push([s.key, s.value])
    } else {
      configEntries.push([s.key, formatValue(s.value)])
    }
  })

  config.parallelSettings.forEach((s) => {
    configEntries.push([s.key, s.value])
  })

  config.walLevel.forEach((s) => {
    configEntries.push([s.key, s.value])
  })

  const configLines = configEntries
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => (isAlterSystem ? `ALTER SYSTEM SET\n ${k} = '${v}';` : `${k} = ${v}`))

  // warnings
  const warningLines = config.warnings.map((w) => `${comment} ${w}`)

  const parts = []
  if (warningLines.length > 0) {
    parts.push(warningLines.join('\n'), '')
  }
  parts.push(hwLines.join('\n'), '', configLines.join('\n'))

  return parts.join('\n') + '\n'
}

export default function handler(req, res) {
  const q = req.query

  // parse and validate inputs
  const dbVersion = parseFloat(q.db_version || '18')
  const osType = (q.os_type || 'linux').toLowerCase()
  const dbType = (q.db_type || 'web').toLowerCase()
  const totalMemory = parseInt(q.total_memory || '0', 10)
  const totalMemoryUnit = (q.total_memory_unit || 'GB').toUpperCase()
  const cpuNum = q.cpus ? parseInt(q.cpus, 10) : null
  const connectionNum = q.connections ? parseInt(q.connections, 10) : null
  const hdType = (q.hd_type || 'ssd').toLowerCase()
  const format = (q.format || 'conf').toLowerCase()

  // validation
  if (!totalMemory || totalMemory <= 0) {
    res.status(400).send(
      `# Ошибка: параметр total_memory обязателен
# Использование:
# curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=conf"
#
# Параметры:
#   db_version      - версия PostgreSQL (10-18, по умолчанию 18)
#   os_type         - linux, windows, mac (по умолчанию linux)
#   db_type         - web, oltp, dw, desktop, mixed (по умолчанию web)
#   total_memory    - объём RAM (обязательно)
#   total_memory_unit - MB или GB (по умолчанию GB)
#   cpus            - количество CPU (необязательно)
#   connections     - количество соединений (необязательно)
#   hd_type         - ssd, hdd, san (по умолчанию ssd)
#   format          - conf или alter (по умолчанию conf)
`
    )
    return
  }

  if (!VALID_DB_TYPES.includes(dbType)) {
    res.status(400).send(`# Ошибка: неверный db_type. Допустимые: ${VALID_DB_TYPES.join(', ')}\n`)
    return
  }
  if (!VALID_OS_TYPES.includes(osType)) {
    res.status(400).send(`# Ошибка: неверный os_type. Допустимые: ${VALID_OS_TYPES.join(', ')}\n`)
    return
  }
  if (!VALID_HD_TYPES.includes(hdType)) {
    res.status(400).send(`# Ошибка: неверный hd_type. Допустимые: ${VALID_HD_TYPES.join(', ')}\n`)
    return
  }
  if (!VALID_MEMORY_UNITS.includes(totalMemoryUnit)) {
    res
      .status(400)
      .send(`# Ошибка: неверный total_memory_unit. Допустимые: ${VALID_MEMORY_UNITS.join(', ')}\n`)
    return
  }

  const params = {
    dbVersion,
    osType,
    dbType,
    totalMemory,
    totalMemoryUnit,
    cpuNum,
    connectionNum,
    hdType
  }

  const config = calculate(params)
  const isAlterSystem = format === 'alter'
  const output = generateOutput(params, config, isAlterSystem)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.status(200).send(output)
}
