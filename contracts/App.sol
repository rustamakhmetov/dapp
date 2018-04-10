pragma solidity ^0.4.11;

import "./Ownable.sol";
import "./iDAPPToken.sol";


contract App is Ownable{

    string public message;
    address public lastDonator;
    iDAPPToken public token;
    uint public price;

    event Message(address _address, string _message);

    function App(iDAPPToken _token){
        token = _token;
        price = 10 * (10 ** uint256(token.decimals()));
    }

    function setPrice(uint _price) onlyOwner {
        price = _price;
    }

    function setMessage(string _message) public returns (bool){
        if (token.payment(msg.sender, price)){
            message = _message;
            lastDonator = msg.sender;
            Message(lastDonator, message);
            return true;
        }
        else {
            return false;
        }
    }
}