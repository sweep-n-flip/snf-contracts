// Sources flattened with hardhat v2.22.18 https://hardhat.org

// SPDX-License-Identifier: GPL-3.0-or-later

// File contracts/core/interfaces/IERC20.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}


// File contracts/core/interfaces/IUniswapV2ERC20.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

interface IUniswapV2ERC20 is IERC20 {
    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
}


// File contracts/core/interfaces/IUniswapV2Pair.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

interface IUniswapV2Pair is IUniswapV2ERC20 {
    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address, bool, bool) external;
}


// File contracts/core/interfaces/IWERC721.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

interface IWERC721 is IERC20 {
    event Mint(address indexed from, address indexed to, uint[] tokenIds);
    event Burn(address indexed from, address indexed to, uint[] tokenIds);

    function factory() external view returns (address);
    function collection() external view returns (address);

    function mint(address to, uint[] memory tokenIds) external;
    function burn(address to, uint[] memory tokenIds) external;

    function initialize(address) external;
}


// File contracts/core/UniswapV2ERC20.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

contract UniswapV2ERC20 is IUniswapV2ERC20 {
    string public constant name = "SweepnFlip LPs";
    string public constant symbol = "SNF-LP";
    uint8 public constant decimals = 18;
    uint  public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    bytes32 public DOMAIN_SEPARATOR;
    // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    bytes32 public constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
    mapping(address => uint) public nonces;

    constructor() {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function _mint(address to, uint value) internal {
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint value) internal {
        balanceOf[from] -= value;
        totalSupply -= value;
        emit Transfer(from, address(0), value);
    }

    function _approve(address owner, address spender, uint value) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _transfer(address from, address to, uint value) private {
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint value) external returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) external returns (bool) {
        if (allowance[from][msg.sender] != type(uint).max) {
            allowance[from][msg.sender] -= value;
        }
        _transfer(from, to, value);
        return true;
    }

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        require(deadline >= block.timestamp, "SweepnFlip: EXPIRED");
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline))
            )
        );
        address recoveredAddress = ecrecover(digest, v, r, s);
        require(recoveredAddress != address(0) && recoveredAddress == owner, "SweepnFlip: INVALID_SIGNATURE");
        _approve(owner, spender, value);
    }
}


// File contracts/core/Delegation.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

//address constant DELEGATE_FACTORY = 0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac; // SushiSwap (Ethereum mainnet)
address constant DELEGATE_FACTORY = 0x71524B4f93c58fcbF659783284E38825f0622859; // SushiSwap (Base mainnet)
//address constant DELEGATE_FACTORY = 0xc35DADB65012eC5796536bD9864eD8773aBc74C4; // SushiSwap (most but Ethereum/Base mainnet)
//address constant DELEGATE_FACTORY = 0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E; // PancakeSwap (Linea mainnet)
//address constant DELEGATE_FACTORY = 0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d; // PancakeSwap (zkSync mainnet)
//address constant DELEGATE_FACTORY = 0x9CC1599D4378Ea41d444642D18AA9Be44f709ffD; // Blasterswap (Blast mainnet)
//address constant DELEGATE_FACTORY = 0x25CbdDb98b35ab1FF77413456B31EC81A6B6B746; // Velodrome (Optimism mainnet)
//address constant DELEGATE_FACTORY = 0xfb926356BAf861c93C3557D7327Dbe8734A71891; // ModeSwap (Mode mainnet)
//address constant DELEGATE_FACTORY = 0x68A384D826D3678f78BB9FB1533c7E9577dACc0E; // StellaSwap (Moombeam mainnet)
//address constant DELEGATE_FACTORY = 0xb08Bfed214ba87d5d5D07B7DA573010016C44488; // Kodiak (Berachain testnet)
//address constant DELEGATE_FACTORY = 0xE578184bC88EB48485Bba23a37B5509578d2aE38; // IceSwap (StratoVM testnet)
//address constant DELEGATE_FACTORY = 0x9945f4a1eC4C4FC74a70276CCf60b8b1B2DE1F4A; // - (Bitfinity testnet)
//address constant DELEGATE_FACTORY = 0x7d8c6B58BA2d40FC6E34C25f9A488067Fe0D2dB4; // Camelot (Apechain)
//address constant DELEGATE_FACTORY = 0x724412C00059bf7d6ee7d4a1d0D5cd4de3ea1C48; // HyperSwap (Hyperliquid mainnet)

bytes constant DELEGATE_INIT_CODE_HASH = hex"e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303"; // SushiSwap (all)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d"; // PancakeSwap (Linea mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"0100045707a42494392b3558029b9869f865ff9df8f375dc1bf20b0555093f43"; // PancakeSwap (zkSync mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"9895581041f0c2ea658b6c2e615187fa4eaa05e55ab576ce8164a1090d8e6575"; // Blasterswap (Blast mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"c1ac28b1c4ebe53c0cff67bab5878c4eb68759bb1e9f73977cd266b247d149f0"; // Velodrome (Optimism mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"337ec3ca78ed47c450332dd308033d9900832b31b7539f3befcbc556bff3a4a8"; // ModeSwap (Mode mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"48a6ca3d52d0d0a6c53a83cc3c8688dd46ea4cb786b169ee959b95ad30f61643"; // StellaSwap (Moombeam mainnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"0489c85ed300c1a9636d09ada5e1bea0e331f778464d45f24cb365c92cafbcb5"; // Kodiak (Berachain testnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"0437378fc27e93c612c5c385779bf540ca2064b54705e48c313aa216da380100"; // IceSwap (StratoVM testnet)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"5ae65da6662188c2e508cb6bcb59f05483a527fc27e586ef49c48f3ef9443469"; // - (Bitfinity testnet)
//bytes constant DELEGATE_INIT_CODE_HASH = ""; // Camelot (Apechain)
//bytes constant DELEGATE_INIT_CODE_HASH = hex"c83d9df19c8c8a0a1229bd3122cbb86fd8ff56f79cc6781c15999d39425466e9"; // HyperSwap (Hyperliquid mainnet)

uint256 constant DELEGATE_NET_FEE = 9970; // SushiSwap
//uint256 constant DELEGATE_NET_FEE = 9975; // PancakeSwap
//uint256 constant DELEGATE_NET_FEE = 9970; // Blasterswap
//uint256 constant DELEGATE_NET_FEE = 9998; // Velodrome
//uint256 constant DELEGATE_NET_FEE = 9997; // ModeSwap
//uint256 constant DELEGATE_NET_FEE = 9975; // StellaSwap
//uint256 constant DELEGATE_NET_FEE = 9970; // Kodiak
//uint256 constant DELEGATE_NET_FEE = 9970; // IceSwap
//uint256 constant DELEGATE_NET_FEE = 9970; // HyperSwap (assumed 0.3% fee like Uniswap V2)

bool constant DELEGATE_CREATE2_ZKSYNC = false;
//bool constant DELEGATE_CREATE2_ZKSYNC = true;

bool constant DELEGATE_VELODROME = false;
//bool constant DELEGATE_VELODROME = true;


// File contracts/core/interfaces/IUniswapV2Factory.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
    event WrapperCreated(address indexed collection, address wrapper, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function getCollection(address wrapper) external view returns (address collection);
    function getWrapper(address collection) external view returns (address wrapper);
    function allWrappers(uint) external view returns (address wrapper);
    function allWrappersLength() external view returns (uint);

    function delegates(address token0, address token1) external view returns (bool);

    function router(address router) external view returns (bool);
    function routerSetter() external view returns (address);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function createWrapper(address collection) external returns (address wrapper);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;

    function setRouter(address, bool) external;
    function setRouterSetter(address) external;
}

interface IUniswapV2FactoryExt is IUniswapV2Factory {
    function pairCodeHash() external view returns (bytes32 _pairCodeHash); // sushiswap extension
    function INIT_CODE_PAIR_HASH() external view returns (bytes32 _INIT_CODE_PAIR_HASH); // pancakeswap extension
    function getPair(address tokenA, address tokenB, bool stable) external view returns (address pair); // velodrome extension
    function createPair(address tokenA, address tokenB, bool stable) external returns (address pair); // velodrome extension
}


// File contracts/core/interfaces/IUniswapV2Callee.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

interface IUniswapV2Callee {
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external;
}


// File contracts/core/libraries/Math.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

// a library for performing various math operations

library Math {
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    // babylonian method (https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
    function sqrt(uint y) internal pure returns (uint z) {
        unchecked {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        }
    }
}


// File contracts/core/libraries/UQ112x112.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

// a library for handling binary fixed point numbers (https://en.wikipedia.org/wiki/Q_(number_format))

// range: [0, 2**112 - 1]
// resolution: 1 / 2**112

library UQ112x112 {
    uint224 constant Q112 = 2**112;

    // encode a uint112 as a UQ112x112
    function encode(uint112 y) internal pure returns (uint224 z) {
        unchecked {
        z = uint224(y) * Q112; // never overflows
        }
    }

    // divide a UQ112x112 by a uint112, returning a UQ112x112
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        unchecked {
        z = x / uint224(y);
        }
    }
}


// File contracts/core/UniswapV2Pair.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;







contract UniswapV2Pair is IUniswapV2Pair, UniswapV2ERC20 {
    using UQ112x112 for uint224;

    uint public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));

    address public factory;
    address public token0;
    address public token1;

    uint112 private reserve0;           // uses single storage slot, accessible via getReserves
    uint112 private reserve1;           // uses single storage slot, accessible via getReserves
    uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;
    uint public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

    bool public discrete0;
    bool public discrete1;

    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "SweepnFlip: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SweepnFlip: TRANSFER_FAILED");
    }

    constructor() {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1, bool _discrete0, bool _discrete1) external {
        require(msg.sender == factory, "SweepnFlip: FORBIDDEN"); // sufficient check
        token0 = _token0;
        token1 = _token1;
        discrete0 = _discrete0;
        discrete1 = _discrete1;
    }

    // update reserves and, on the first call per block, price accumulators
    function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
        unchecked {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "SweepnFlip: OVERFLOW");
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
        }
    }

    // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = IUniswapV2Factory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint rootK = Math.sqrt(uint(_reserve0) * uint(_reserve1));
                uint rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint numerator = totalSupply * (rootK - rootKLast);
                    uint denominator = (rootK * 5) + rootKLast;
                    uint liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(address to) external lock returns (uint liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        uint amount0 = balance0 - _reserve0;
        uint amount1 = balance1 - _reserve1;

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
           _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        } else {
            liquidity = Math.min(amount0 * _totalSupply / _reserve0, amount1 * _totalSupply / _reserve1);
        }
        require(liquidity > 0, "SweepnFlip: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint(reserve0) * uint(reserve1); // reserve0 and reserve1 are up-to-date
        emit Mint(msg.sender, amount0, amount1);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to) external lock returns (uint amount0, uint amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        address _token0 = token0;                                // gas savings
        address _token1 = token1;                                // gas savings
        uint balance0 = IERC20(_token0).balanceOf(address(this));
        uint balance1 = IERC20(_token1).balanceOf(address(this));
        uint liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        amount0 = liquidity * balance0 / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = liquidity * balance1 / _totalSupply; // using balances ensures pro-rata distribution
        /*
        if (discrete0) {
            uint residual0 = amount0 % 1e18;
            if (residual0 > 0) {
                if (residual0 + 1e10 >= 1e18 && amount0 + 1e18 < balance0) { // attempts to fix rounding error
                    amount0 += 1e18 - residual0;
                }
                else
                {
                    amount0 -= residual0;
                    amount1 += residual0 * (balance1 - amount1) / (balance0 - amount0);
                }
            }
        }
        else
        if (discrete1) {
            uint residual1 = amount1 % 1e18;
            if (residual1 > 0) {
                if (residual1 + 1e10 >= 1e18 && amount1 + 1e18 < balance1) { // attempts to fix rounding error
                    amount1 += 1e18 - residual1;
                }
                else
                {
                    amount1 -= residual1;
                    amount0 += residual1 * (balance0 - amount0) / (balance1 - amount1);
                }
            }
        }
        */
        require(amount0 > 0 && amount1 > 0, "SweepnFlip: INSUFFICIENT_LIQUIDITY_BURNED");
        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint(reserve0) * uint(reserve1); // reserve0 and reserve1 are up-to-date
        emit Burn(msg.sender, amount0, amount1, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, "SweepnFlip: INSUFFICIENT_OUTPUT_AMOUNT");
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "SweepnFlip: INSUFFICIENT_LIQUIDITY");

        uint balance0;
        uint balance1;
        { // scope for _token{0,1}, avoids stack too deep errors
        address _token0 = token0;
        address _token1 = token1;
        require(to != _token0 && to != _token1, "SweepnFlip: INVALID_TO");
        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
        if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "SweepnFlip: INSUFFICIENT_INPUT_AMOUNT");
        { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
        uint balance0Adjusted = balance0 * 100 - amount0In * 2;
        uint balance1Adjusted = balance1 * 100 - amount1In * 2;
        require(balance0Adjusted * balance1Adjusted >= uint(_reserve0) * uint(_reserve1) * 100**2, "SweepnFlip: K");
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    // force balances to match reserves
    function skim(address to) external lock {
        address _token0 = token0; // gas savings
        address _token1 = token1; // gas savings
        _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)) - reserve0);
        _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)) - reserve1);
    }

    // force reserves to match balances
    function sync() external lock {
        _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
    }
}


// File contracts/core/interfaces/IERC721.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

interface IERC721 {
    event Approval(address indexed owner, address indexed spender, uint indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed spender, bool approved);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function getApproved(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address spender) external view returns (bool);

    function approve(address spender, uint256 tokenId) external;
    function setApprovalForAll(address spender, bool approved) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}


// File contracts/core/WERC721.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;



contract WERC721 is IWERC721 {
    uint8 public constant decimals = 18;
    uint  public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    address public factory;
    address public collection;

    function name() public view returns (string memory) {
        return string(abi.encodePacked("Wrapped ", IERC721(collection).name()));
    }

    function symbol() public view returns (string memory) {
        return string(abi.encodePacked("W", IERC721(collection).symbol()));
    }

    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "SweepnFlip: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    modifier onlyRouter() {
        require(IUniswapV2Factory(factory).router(msg.sender), "SweepnFlip: FORBIDDEN");
        _;
    }

    constructor() {
        factory = msg.sender;
    }

    function initialize(address _collection) external {
        require(msg.sender == factory, "SweepnFlip: FORBIDDEN"); // sufficient check
        collection = _collection;
    }

    function _mint(address from, address to, uint[] memory tokenIds) private {
        uint count = tokenIds.length;
        uint value = count * 1e18;
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
        for (uint i = 0; i < count; i++) {
            IERC721(collection).transferFrom(from, address(this), tokenIds[i]);
        }
        emit Mint(from, to, tokenIds);
    }

    function _burn(address from, address to, uint[] memory tokenIds) private {
        uint count = tokenIds.length;
        uint value = count * 1e18;
        balanceOf[from] -= value;
        totalSupply -= value;
        emit Transfer(from, address(0), value);
        for (uint i = 0; i < count; i++) {
            IERC721(collection).transferFrom(address(this), to, tokenIds[i]);
        }
        emit Burn(from, to, tokenIds);
    }

    function _approve(address owner, address spender, uint value) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _transfer(address from, address to, uint value) private {
        /*
        require(value % 1e18 == 0, "SweepnFlip: PARTIAL_AMOUNT");
        */
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint value) external returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function mint(address to, uint[] memory tokenIds) external onlyRouter lock {
        _mint(msg.sender, to, tokenIds);
    }

    function burn(address to, uint[] memory tokenIds) external onlyRouter lock {
        _burn(msg.sender, to, tokenIds);
    }

    function transfer(address to, uint value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) external returns (bool) {
        if (allowance[from][msg.sender] != type(uint).max) {
            allowance[from][msg.sender] -= value;
        }
        _transfer(from, to, value);
        return true;
    }
}


// File contracts/core/UniswapV2Factory.sol

// Original license: SPDX_License_Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;






contract UniswapV2Factory is IUniswapV2Factory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    mapping(address => address) public getCollection;
    mapping(address => address) public getWrapper;
    address[] public allWrappers;

    mapping(address => mapping(address => bool)) public delegates;

    mapping(address => bool) public router;
    address public routerSetter;

    constructor(address _feeToSetter, address _routerSetter) {
        feeToSetter = _feeToSetter;
        routerSetter = _routerSetter;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function allWrappersLength() external view returns (uint) {
        return allWrappers.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "SweepnFlip: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "SweepnFlip: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "SweepnFlip: PAIR_EXISTS"); // single check is sufficient
        bool discrete0 = getCollection[token0] != address(0);
        bool discrete1 = getCollection[token1] != address(0);
        /*
        require(!(discrete0 && discrete1), "SweepnFlip: DISCRETE_CLASH");
        */
        if (discrete0 || discrete1) {
            bytes32 salt = keccak256(abi.encodePacked(token0, token1));
            pair = address(new UniswapV2Pair{salt: salt}());
            IUniswapV2Pair(pair).initialize(token0, token1, discrete0, discrete1);
        } else {
            require(tokenA.code.length != 0 && tokenB.code.length != 0, "SweepnFlip: DELEGATION_RESTRICTED");
            if (DELEGATE_VELODROME) {
                pair = IUniswapV2FactoryExt(DELEGATE_FACTORY).getPair(tokenA, tokenB, false);
                if (pair == address(0)) {
                    pair = IUniswapV2FactoryExt(DELEGATE_FACTORY).createPair(tokenA, tokenB, false);
                }
            } else {
                pair = IUniswapV2Factory(DELEGATE_FACTORY).getPair(tokenA, tokenB);
                if (pair == address(0)) {
                    pair = IUniswapV2Factory(DELEGATE_FACTORY).createPair(tokenA, tokenB);
                }
            }
            delegates[token0][token1] = true;
        }
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function createWrapper(address collection) external returns (address wrapper) {
        require(collection != address(0), "SweepnFlip: ZERO_ADDRESS");
        require(getWrapper[collection] == address(0), "SweepnFlip: WRAPPER_EXISTS");
        bytes32 salt = keccak256(abi.encodePacked(collection));
        wrapper = address(new WERC721{salt: salt}());
        IWERC721(wrapper).initialize(collection);
        getCollection[wrapper] = collection;
        getWrapper[collection] = wrapper;
        allWrappers.push(wrapper);
        emit WrapperCreated(collection, wrapper, allWrappers.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "SweepnFlip: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "SweepnFlip: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    function setRouter(address _router, bool _enabled) external {
        require(msg.sender == routerSetter, "SweepnFlip: FORBIDDEN");
        router[_router] = _enabled;
    }

    function setRouterSetter(address _routerSetter) external {
        require(msg.sender == routerSetter, "SweepnFlip: FORBIDDEN");
        routerSetter = _routerSetter;
    }

    function _initCodeHash() external pure returns (bytes32) {
        return keccak256(type(UniswapV2Pair).creationCode);
    }
}
