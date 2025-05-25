export const contractAddress = "0x29a79095352a718B3D7Fe84E1F14E9F34A35598e";
export const abi = [
    {
        "type": "constructor",
        "inputs": [
        {
            "name": "_owner",
            "type": "address",
            "internalType": "address"
        }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "MAX_FEE",
        "inputs": [],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "addEmployee",
        "inputs": [
        {
            "name": "_employee",
            "type": "address",
            "internalType": "address"
        },
        {
            "name": "_salary",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "depositFunds",
        "inputs": [],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "employeeIndex",
        "inputs": [
        {
            "name": "",
            "type": "address",
            "internalType": "address"
        }
        ],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "employees",
        "inputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "outputs": [
        {
            "name": "",
            "type": "address",
            "internalType": "address"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "fixedFee",
        "inputs": [],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getEmployeesCount",
        "inputs": [],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getEmployeesSalaries",
        "inputs": [
        {
            "name": "_employee",
            "type": "address",
            "internalType": "address"
        }
        ],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getOwnersBalance",
        "inputs": [],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
        {
            "name": "",
            "type": "address",
            "internalType": "address"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "payAllEmployees",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "payEmployee",
        "inputs": [
        {
            "name": "_employee",
            "type": "address",
            "internalType": "address"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeEmployee",
        "inputs": [
        {
            "name": "_employee",
            "type": "address",
            "internalType": "address"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "salaries",
        "inputs": [
        {
            "name": "",
            "type": "address",
            "internalType": "address"
        }
        ],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setFixedFee",
        "inputs": [
        {
            "name": "_newFee",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "totalFeesCollected",
        "inputs": [],
        "outputs": [
        {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
        {
            "name": "_newOwner",
            "type": "address",
            "internalType": "address"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "updateSalary",
        "inputs": [
        {
            "name": "_employee",
            "type": "address",
            "internalType": "address"
        },
        {
            "name": "_newSalary",
            "type": "uint256",
            "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "BatchPaymentCompleted",
        "inputs": [
        {
            "name": "totalEmployeesPaid",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        },
        {
            "name": "totalPaid",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        },
        {
            "name": "totalFees",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "EmployeeAdded",
        "inputs": [
        {
            "name": "employee",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        },
        {
            "name": "amount",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "EmployeePaid",
        "inputs": [
        {
            "name": "employee",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        },
        {
            "name": "amount",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        },
        {
            "name": "fee",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "EmployeeRemoved",
        "inputs": [
        {
            "name": "employee",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "FeeCollected",
        "inputs": [
        {
            "name": "owner",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        },
        {
            "name": "fee",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "FeeTransferFailed",
        "inputs": [
        {
            "name": "employee",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        },
        {
            "name": "fee",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "FundsDeposited",
        "inputs": [
        {
            "name": "sender",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        },
        {
            "name": "amount",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnershipTransferred",
        "inputs": [
        {
            "name": "newOwner",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SalaryTransferFailed",
        "inputs": [
        {
            "name": "employee",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        },
        {
            "name": "amount",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SalaryUpdated",
        "inputs": [
        {
            "name": "employee",
            "type": "address",
            "indexed": true,
            "internalType": "address"
        },
        {
            "name": "newSalary",
            "type": "uint256",
            "indexed": false,
            "internalType": "uint256"
        }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "EmployeeAlreadyExists",
        "inputs": []
    },
    {
        "type": "error",
        "name": "EmployeeNotFound",
        "inputs": []
    },
    {
        "type": "error",
        "name": "FeeTooHigh",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientFunds",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidAddress",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidSalary",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotAuthorized",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotEnoughFunds",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TransferFailed",
        "inputs": []
    }
];

export const factoryAbi = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"approvedCompanies","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"companyToPayroll","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"createPayrollContract","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getCompanyPayroll","inputs":[{"name":"_company","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"i_admin","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"payrollContracts","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"event","name":"FactoryCreated","inputs":[{"name":"company","type":"address","indexed":true,"internalType":"address"},{"name":"payrollContract","type":"address","indexed":false,"internalType":"address"},{"name":"timestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"AlreadyRegistered","inputs":[]}];