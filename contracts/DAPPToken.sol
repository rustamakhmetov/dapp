// Указываем версию для компилятора
pragma solidity ^0.4.11;

import "./Ownable.sol";
import "./App.sol";

// Инициализация контракта
contract DAPPToken is Ownable {

    // Объявляем переменную в которой будет название токена
    string public name;
    // Объявляем переменную в которой будет символ токена
    string public symbol;
    // Объявляем переменную в которой будет число нулей токена
    uint8 public decimals;
    uint256 public buyPrice;
    // Объявляем переменную в которой будет храниться общее число токенов
    uint256 public totalSupply;
    address public appContract;

    // Объявляем маппинг для хранения балансов пользователей
    mapping (address => uint256) public balanceOf;
    // Объявляем маппинг для хранения одобренных транзакций
    mapping (address => mapping (address => uint256)) public allowance;

    // Объявляем эвент для логгирования события перевода токенов
    event Transfer(address from, address to, uint256 value);
    // Объявляем эвент для логгирования события одобрения перевода токенов
    event Approval(address from, address to, uint256 value);

    event Vote(address from, int current, uint numberOfVotes);

    event Log(string _message);
    event LogA(string _message, address _address);

    // Функция инициализации контракта
    function DAPPToken(){
        // Указываем число нулей
        decimals = 18;
        // Объявляем общее число токенов, которое будет создано при инициализации
        totalSupply = 1000000 * (10 ** uint256(decimals));
        // 10000000 * (10^decimals)

        // "Отправляем" все токены на баланс того, кто инициализировал создание контракта токена
        balanceOf[this] = totalSupply;

        // Указываем название токена
        name = "DAPP Token";
        // Указываем символ токена
        symbol = "DAPPT";
        LogA("DAPPToken init", msg.sender);
    }

    function setBuyPrice(uint256 _price) public {
        buyPrice = _price;
    }

    // Внутренняя функция для перевода токенов
    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        // Проверка того, что отправителю хватает токенов для перевода
        require(balanceOf[_to] + _value >= balanceOf[_to]);

        balanceOf[_to] += _value;
        // Токены списываются у отправителя
        balanceOf[_from] -= _value;
        // Токены прибавляются получателю

        Transfer(_from, _to, _value);
        // Перевод токенов
    }

    // Функция для перевода токенов
    function transfer(address _to, uint256 _value) public {
        _transfer(this, _to, _value);
        // Вызов внутренней функции перевода
    }

    // Функция для перевода "одобренных" токенов
    function transferFrom(address _from, address _to, uint256 _value) public {
        // Проверка, что токены были выделены аккаунтом _from для аккаунта _to
        require(_value <= allowance[_from][_to]);
        allowance[_from][_to] -= _value;
        // Отправка токенов
        _transfer(_from, _to, _value);
    }

    // Функция для "одобрения" перевода токенов
    function approve(address _to, uint256 _value) public {
        allowance[msg.sender][_to] = _value;
        Approval(msg.sender, _to, _value);
        // Вызов эвента для логгирования события одобрения перевода токенов
    }

    function setAppContract(address _app) onlyOwner {
        appContract = _app;
    }

    function payment(address _from, uint value) returns (bool) {
        require(msg.sender == address(appContract));
        if (balanceOf[_from] >= value) {
            balanceOf[appContract] += value;
            balanceOf[_from] -= value;
            return true;
        }
        else {
            return false;
        }

    }
}