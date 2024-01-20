const ROLES = {
    ['ADMIN']: {
        shortName: 'ADMIN',
        fullName: 'Admin',
        department: 'ALL',
    },
    ['G']: {
        shortName: 'G',
        fullName: 'Владелец системы',
        department: 'ALL',
    },
    //КОММЕРЧЕСКИЙ ОТДЕЛ
    ['KD']: {
        shortName: 'KD',
        fullName: 'Коммерческий директор',
        department: 'COMERCIAL',
    },
    //менеджеры
    ['DO']: {
        shortName: 'DO',
        fullName: 'Директор отдела продаж',
        department: 'COMERCIAL'
    },
    ['ROP']: {
        shortName: 'ROP',
        fullName: 'Руководитель отдела продаж',
        department: 'COMERCIAL'
    },
    ['MOP']: {
        shortName: 'MOP',
        fullName: 'Менеджер отдела продаж',
        department: 'COMERCIAL'
    },
    //ведение(лтв)
    ['ROV']: {
        shortName: 'ROV',
        fullName: 'Руководитель отдела ведения',
        department: 'COMERCIAL'
    },
    ['MOV']: {
        shortName: 'MOV',
        fullName: 'Менеджер отдела ведения',
        department: 'COMERCIAL'
    },
    //дизайнеры
    ['ROD']: {
        shortName: 'ROD',
        fullName: 'Руководитель отдела дизайна',
        department: 'DESIGN'
    },
    ['DIZ']: {
        shortName: 'DIZ',
        fullName: 'Дизайнер',
        department: 'DESIGN'
    },
    //ПРОИЗВОДСТВО
    ['DP']: {
        shortName: 'DP',
        fullName: 'Директор производств',
        department: 'PRODUCTION'
    },
    ['RP']: {
        shortName: 'RP',
        fullName: 'Руководитель филиала',
        department: 'PRODUCTION'
    },
    ['FRZ']: {
        shortName: 'FRZ',
        fullName: "Фрезеровщик",
        department: 'PRODUCTION'
    },
    ['LAM']: {
        shortName: 'LAM',
        fullName: "Монтажник пленки",
        department: 'PRODUCTION'
    },
    ['MASTER']: {
        shortName: 'MASTER',
        fullName: "Сборщик",
        department: 'PRODUCTION'
    },
    ['PACKER']: {
        shortName: 'PACKER',
        fullName: "Упаковщик",
        department: 'PRODUCTION'
    },
};

module.exports = ROLES;