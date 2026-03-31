// const mongoose = require("mongoose");

// const CollegeSchema = new mongoose.Schema({

//     name: {
//         type: String,
//         required: true
//     },

//     code: {
//         type: String,
//         required: true,
//         unique: true
//     },

//     address: {
//         area: String,
//         city: String,
//         state: String,
//         pincode: String
//     },

//     streams: [
//         {
//             name: {
//                 type: String,
//                 enum: ["Science", "Commerce", "Arts"],
//                 required: true
//             },

//             fundingTypes: [
//                 {
//                     type: {
//                         type: String,
//                         enum: ["AIDED", "UNAIDED", "SELF_FINANCED"],
//                         required: true
//                     },

//                     baseFee: {
//                         type: Number,
//                         required: true
//                     },

//                     casteFees: [
//                         {
//                             caste: {
//                                 type: String,
//                                 enum: ["OPEN", "OBC", "SC", "ST", "EWS"]
//                             },
//                             multiplier: {
//                                 type: Number
//                             }
//                         }
//                     ]
//                 }
//             ],

//             subjectGroups: [
//                 {
//                     groupType: {
//                         type: String,
//                         enum: ["LANGUAGE", "CORE", "OPTIONAL", "BIFOCAL"]
//                     },

//                     maxSelectable: {
//                         type: Number,
//                         required: true
//                     },

//                     subjects: [
//                         {
//                             name: String,

//                             minPercentageRequired: {
//                                 type: Number
//                             },

//                             additionalFee: {
//                                 type: Number,
//                                 default: 0
//                             }
//                         }
//                     ]
//                 }
//             ],

//             meritYears: [
//                 {
//                     year: {
//                         type: Number,
//                         required: true
//                     },

//                     rounds: [
//                         {
//                             roundNumber: {
//                                 type: Number,
//                                 enum: [1, 2, 3]
//                             },

//                             categoryCutoffs: [
//                                 {
//                                     caste: {
//                                         type: String,
//                                         enum: ["OPEN", "OBC", "SC", "ST", "EWS"]
//                                     },

//                                     cutoffPercentage: {
//                                         type: Number
//                                     }
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]

// }, { timestamps: true });

// module.exports = mongoose.model("College", CollegeSchema);


const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    address: {
        area: String,
        city: String,
        state: String,
        pincode: String
    },

    streams: [
        {
            name: {
                type: String,
                enum: ["Science", "Commerce", "Arts"],
                required: true
            },

            subjectGroups: [
                {
                    groupType: {
                        type: String,
                        enum: ["LANGUAGE", "CORE", "OPTIONAL", "BIFOCAL"]
                    },

                    maxSelectable: {
                        type: Number,
                        required: true
                    },

                    subjects: [
                        {
                            name: String,
                            minPercentageRequired: Number,
                            additionalFee: {
                                type: Number,
                                default: 0
                            }
                        }
                    ]
                }
            ],

            fundingTypes: [
                {
                    type: {
                        type: String,
                        enum: ["AIDED", "UNAIDED", "SELF_FINANCED", "MINORITY"],
                        required: true
                    },

                    baseFee: {
                        type: Number,
                        required: true
                    },

                    meritYears: [
                        {
                            year: {
                                type: Number,
                                required: true
                            },

                            rounds: [
                                {
                                    roundNumber: {
                                        type: Number,
                                        enum: [1, 2, 3],
                                        required: true
                                    },

                                    cutoffPercentage: {
                                        type: Number,
                                        required: true
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("College", CollegeSchema);