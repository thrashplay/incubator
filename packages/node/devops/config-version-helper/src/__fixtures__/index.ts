export const baseStack = {
  version: '3.7',
  services: {
    image: 'anything/test:latest',
  },
}

export const validConfigs = {
  test_config1: {
    name: 'test_config1_name',
    file: 'test_config1_file',
  },
  test_config2: {
    name: 'test_config2_name',
    file: 'test_config2_file',
  },
}

export const configsWithNoFile = {
  no_file_config1: {
    name: 'no_file_config1_name',
  },
  no_file_config2: { },
  external_config: {
    name: 'external_config_name',
    external: true,
  },
}