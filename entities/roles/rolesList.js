// const ROLES = {
//     ['ADMIN']: {
//         shortName: 'ADMIN',
//         fullName: 'Admin',
//         department: 'ALL',
//     },
//     ['G']: {
//         shortName: 'G',
//         fullName: 'Владелец системы',
//         department: 'ALL',
//     },
//     //КОММЕРЧЕСКИЙ ОТДЕЛ
//     ['KD']: {
//         shortName: 'KD',
//         fullName: 'Коммерческий директор',
//         department: 'COMERCIAL',
//     },
//     //менеджеры
//     ['DO']: {
//         shortName: 'DO',
//         fullName: 'Директор отдела продаж',
//         department: 'COMERCIAL'
//     },
//     ['ROP']: {
//         shortName: 'ROP',
//         fullName: 'Руководитель отдела продаж',
//         department: 'COMERCIAL'
//     },
//     ['MOP']: {
//         shortName: 'MOP',
//         fullName: 'Менеджер отдела продаж',
//         department: 'COMERCIAL'
//     },
//     //ведение(лтв)
//     ['ROV']: {
//         shortName: 'ROV',
//         fullName: 'Руководитель отдела ведения',
//         department: 'COMERCIAL'
//     },
//     ['MOV']: {
//         shortName: 'MOV',
//         fullName: 'Менеджер отдела ведения',
//         department: 'COMERCIAL'
//     },
//     //дизайнеры
//     ['ROD']: {
//         shortName: 'ROD',
//         fullName: 'Руководитель отдела дизайна',
//         department: 'DESIGN'
//     },
//     ['DIZ']: {
//         shortName: 'DIZ',
//         fullName: 'Дизайнер',
//         department: 'DESIGN'
//     },
//     //ПРОИЗВОДСТВО
//     ['DP']: {
//         shortName: 'DP',
//         fullName: 'Директор производств',
//         department: 'PRODUCTION'
//     },
//     ['RP']: {
//         shortName: 'RP',
//         fullName: 'Руководитель филиала',
//         department: 'PRODUCTION'
//     },
//     ['FRZ']: {
//         shortName: 'FRZ',
//         fullName: "Фрезеровщик",
//         department: 'PRODUCTION'
//     },
//     ['LAM']: {
//         shortName: 'LAM',
//         fullName: "Монтажник пленки",
//         department: 'PRODUCTION'
//     },
//     ['MASTER']: {
//         shortName: 'MASTER',
//         fullName: "Сборщик",
//         department: 'PRODUCTION'
//     },
//     ['PACKER']: {
//         shortName: 'PACKER',
//         fullName: "Упаковщик",
//         department: 'PRODUCTION'
//     },
// };

const administration = [
    {
        shortName: 'ADMIN',
        fullName: 'Admin',
        department: 'administration',
        workStages: []
    },
    {
        shortName: 'G',
        fullName: 'Владелец системы',
        department: 'administration',
        workStages: [1,2,3,4,5,6,7]
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
        department: 'COMERCIAL'
    },
    {
        shortName: 'ROP',
        fullName: 'Руководитель отдела продаж',
        department: 'COMERCIAL'
    },
    {
        shortName: 'MOP',
        fullName: 'Менеджер отдела продаж',
        department: 'COMERCIAL'
    },
    //ведение(лтв)
    {
        shortName: 'ROV',
        fullName: 'Руководитель отдела ведения',
        department: 'COMERCIAL'
    },
    {
        shortName: 'MOV',
        fullName: 'Менеджер отдела ведения',
        department: 'COMERCIAL'
    },
    //дизайнеры
    {
        shortName: 'ROD',
        fullName: 'Руководитель отдела дизайна',
        department: 'DESIGN'
    },
    {
        shortName: 'DIZ',
        fullName: 'Дизайнер',
        department: 'DESIGN'
    },
    //ПРОИЗВОДСТВО
    {
        shortName: 'DP',
        fullName: 'Директор производств',
        department: 'PRODUCTION',
        workStages: [1, 2, 3, 4, 5, 6, 7, 8]

    },
    {
        shortName: 'RP',
        fullName: 'Руководитель филиала',
        department: 'PRODUCTION',
        workStages: [1, 2, 3, 4, 5, 6, 7, 8]

    },
    {
        shortName: 'FRZ',
        fullName: "Фрезеровщик",
        department: 'PRODUCTION',
        workStages: [2]

    },
    {
        shortName: 'LAM',
        fullName: "Монтажник пленки",
        department: 'PRODUCTION',
        workStages: [1, 2, 3, 4, 5, 6, 7]

    },
    {
        shortName: 'MASTER',
        fullName: "Сборщик",
        department: 'PRODUCTION',
        workStages: [1, 2, 3, 4, 5, 6, 7]

    },
    {
        shortName: 'PACKER',
        fullName: "Упаковщик",
        department: 'PRODUCTION',
        workStages: [1, 2, 3, 4, 5, 6, 7]

    },
];

module.exports = {
    administration,
    ROLES
};