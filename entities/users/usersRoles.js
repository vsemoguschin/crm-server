const ROLES = {
    ['ADMIN']: {
        fullName: 'Admin',
    },
    ['G']: {
        fullName: 'Владелец системы',
    },
    //КОММЕРЧЕСКИЙ ОТДЕЛ
    ['KD']: {
        fullName: 'Коммерческий директор',
        department: 'COMERCIAL',
    },
    //менеджеры
    ['DO']: {
        fullName: 'Директор отдела продаж',
        department: 'COMERCIAL'
    },
    ['ROP']: {
        fullName: 'Руководитель отдела продаж',
        department: 'COMERCIAL'
    },
    ['MOP']: {
        fullName: 'Менеджер отдела продаж',
        department: 'COMERCIAL'
    },
    //ведение(лтв)
    ['ROV']: {
        fullName: 'Руководитель отдела ведения',
        department: 'COMERCIAL'
    },
    ['MOV']: {
        fullName: 'Менеджер отдела ведения',
        department: 'COMERCIAL'
    },
    //дизайнеры
    ['ROD']: 'Руководитель отдела дизайна',
    ['DIZ']: 'Дизайнер',
    //ПРОИЗВОДСТВО
    ['DP']: 'Директор производств',
    ['RP']: 'Руководитель филиала',
    ['FRZ']: "Фрезеровщик",
    ['LAM']: "Монтажник пленки",
    ['MASTER']: "Сборщик",
    ['PACKER']: "Упаковщик",
    // ['']: "Отправщик",
};


module.exports = ROLES;