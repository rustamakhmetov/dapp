// Указываем версию для компилятора
pragma solidity ^0.4.11;

import "./iDAPPToken.sol";


// Объявляем контракт
contract ICO {

    // Объявляем переменную для стомости токена
    uint256 public buyPrice;
    // Объявялем переменную для токена
    iDAPPToken public token;

    // Функция инициализации
    function ICO(iDAPPToken _token){
        // Присваиваем токен
        token = _token;
        // Присваем стоимость
        buyPrice = 1 finney;
        _token.setBuyPrice(buyPrice);
    }

    // Функция для прямой отправки эфиров на контракт
    function () payable {
        _buy(msg.sender, msg.value);
    }

    // Вызываемая функция для отправки эфиров на контракт, возвращающая количество купленных токенов
    function buy() payable returns (uint){
        // Получаем число купленных токенов
        uint tokens = _buy(msg.sender, msg.value);
        // Возвращаем значение
        return tokens;
    }

    // Внутренняя функция покупки токенов, возвращает число купленных токенов
    function _buy(address _sender, uint256 _amount) internal returns (uint){
        // Рассчитываем стоимость
        uint tokens = _amount * (10 ** uint256(token.decimals())) / buyPrice;
        // Отправляем токены с помощью вызова метода токена
        token.transfer(_sender, tokens);
        // Возвращаем значение
        return tokens;
    }
}