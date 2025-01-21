const ROLES = {
  //admins
  ['ADMIN']: {
    fullName: 'Admin',
    department: 'administration',
    availableRoles: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
  },
  ['G']: {
    fullName: 'Владелец системы',
    department: 'administration',
    availableRoles: ['KD', 'DO', 'ROP', 'MOP', 'ROV', 'MOV', 'DP', 'RP', 'FRZ', 'MASTER', 'PACKER'],
  },
  //КОММЕРЧЕСКИЙ ОТДЕЛ
  ['KD']: {
    fullName: 'Коммерческий директор',
    department: 'COMMERCIAL',
    availableRoles: ['DO', 'ROP', 'MOP', 'ROV', 'MOV'],
  },
  //менеджеры
  ['DO']: {
    fullName: 'Директор отдела продаж',
    department: 'COMMERCIAL',
    availableRoles: ['ROP', 'MOP'],
  },
  ['ROP']: {
    fullName: 'Руководитель отдела продаж',
    department: 'COMMERCIAL',
    availableRoles: ['MOP'],
  },
  ['MOP']: {
    fullName: 'Менеджер отдела продаж',
    department: 'COMMERCIAL',
    availableRoles: [],
  },
  //ведение(лтв)
  ['ROV']: {
    fullName: 'Руководитель отдела ведения',
    department: 'COMMERCIAL',
    availableRoles: ['MOV'],
  },
  ['MOV']: {
    fullName: 'Менеджер отдела ведения',
    department: 'COMMERCIAL',
    availableRoles: [],
  },
  //дизайнеры
  ['ROD']: {
    fullName: 'Руководитель отдела дизайна',
    department: 'DESIGN',
    availableRoles: [],
  },
  ['DIZ']: {
    fullName: 'Дизайнер',
    department: 'DESIGN',
    availableRoles: [],
  },
  //ПРОИЗВОДСТВО
  ['DP']: {
    fullName: 'Директор производства',
    department: 'PRODUCTION',
    availableRoles: ['RP', 'FRZ', 'MASTER', 'PACKER'],
  },
  ['RP']: {
    fullName: 'Руководитель производства',
    department: 'PRODUCTION',
    availableRoles: ['FRZ', 'MASTER', 'PACKER'],
  },
  ['LOGIST']: {
    fullName: 'Логист',
    department: 'PRODUCTION',
    availableRoles: [],
  },
  ['FRZ']: {
    fullName: 'Фрезеровщик',
    department: 'PRODUCTION',
    availableRoles: [],
  },
  ['LAM']: {
    fullName: 'Монтажник пленки',
    department: 'PRODUCTION',
    availableRoles: [],
  },
  ['MASTER']: {
    fullName: 'Сборщик',
    department: 'PRODUCTION',
    availableRoles: [],
  },
  ['PACKER']: {
    fullName: 'Упаковщик',
    department: 'PRODUCTION',
    availableRoles: [],
  },
  ['MTZ']: {
    fullName: 'Менеджер ТЗ',
    department: 'PRODUCTION',
    availableRoles: [],
  },
};

module.exports = {
  ROLES,
};
