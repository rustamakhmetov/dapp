pragma solidity ^0.4.11;

import "./Ownable.sol";
import "./iDAPPToken.sol";


contract App is Ownable{

    string public message;
    address public lastDonator;
    iDAPPToken public token;
    uint public price = 10;

    function App(iDAPPToken _token){
        token = _token;
    }

    function setPrice(uint _price) onlyOwner {
        price = _price;
    }

    function setMessage(string _message) returns (bool){
        if (token.payment(msg.sender, price)){
            message = _message;
            lastDonator = msg.sender;
            return true;
        }
        else {
            return false;
        }
    }
}