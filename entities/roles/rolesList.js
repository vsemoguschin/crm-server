const administration = [
  {
    shortName: 'ADMIN',
    fullName: 'Admin',
    department: 'administration',
    workStages: [1, 2, 3, 4, 5],
  },
  {
    shortName: 'G',
    fullName: 'Владелец системы',
    department: 'administration',
    workStages: [1, 2, 3, 4, 5],
  },
];
const ROLES = [
  //КОММЕРЧЕСКИЙ ОТДЕЛ
  {
    shortName: 'KD',
    fullName: 'Коммерческий директор',
    department: 'COMERCIAL',
  },
  //менеджеры
  {
    shortName: 'DO',
    fullName: 'Директор отдела продаж',
    department: 'COMERCIAL',
  },
  {
    shortName: 'ROP',
    fullName: 'Руководитель отдела продаж',
    department: 'COMERCIAL',
  },
  {
    shortName: 'MOP',
    fullName: 'Менеджер отдела продаж',
    department: 'COMERCIAL',
  },
  //ведение(лтв)
  {
    shortName: 'ROV',
    fullName: 'Руководитель отдела ведения',
    department: 'COMERCIAL',
  },
  {
    shortName: 'MOV',
    fullName: 'Менеджер отдела ведения',
    department: 'COMERCIAL',
  },
  //дизайнеры
  {
    shortName: 'ROD',
    fullName: 'Руководитель отдела дизайна',
    department: 'DESIGN',
  },
  {
    shortName: 'DIZ',
    fullName: 'Дизайнер',
    department: 'DESIGN',
  },
  //ПРОИЗВОДСТВО
  {
    shortName: 'DP',
    fullName: 'Директор производств',
    department: 'PRODUCTION',
    workStages: [1, 2, 3, 4, 5],
  },
  {
    shortName: 'RP',
    fullName: 'Руководитель филиала',
    department: 'PRODUCTION',
    workStages: [1, 2, 3, 4, 5],
  },
  {
    shortName: 'FRZ',
    fullName: 'Фрезеровщик',
    department: 'PRODUCTION',
    workStages: [1],
  },
  {
    shortName: 'LAM',
    fullName: 'Монтажник пленки',
    department: 'PRODUCTION',
    workStages: [1, 2],
  },
  {
    shortName: 'MASTER',
    fullName: 'Сборщик',
    department: 'PRODUCTION',
    workStages: [3],
  },
  {
    shortName: 'PACKER',
    fullName: 'Упаковщик',
    department: 'PRODUCTION',
    workStages: [4, 5],
  },
];

module.exports = {
  administration,
  ROLES,
};
