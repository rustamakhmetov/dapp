pragma solidity ^0.4.11;

// Объявляем интерфейс
interface iDAPPToken {
    function transfer(address _receiver, uint256 _amount);
    function payment(address _from, uint value) returns (bool);
    function decimals() returns (uint8);
    function setBuyPrice(uint256 _price);
}
