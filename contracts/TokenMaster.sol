// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint32 public eventId;
    uint256 public totalSupply;

    struct mainEvent {
        uint32 id;
        string eventName;
        uint256 cost;
        uint16 maxTickets;
        string date;
        string time;
        string location;
    }
    mapping (uint32 => mainEvent) private allEvents;

    modifier onlyOwner() {
        msg.sender == owner;
        _;
    }

    constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list (string memory _eventName, uint256 _cost, uint16 _maxTickets, string memory _date, string memory _time, string memory _location) public  onlyOwner {
        eventId++;
        allEvents[eventId] = mainEvent(eventId, _eventName, _cost, _maxTickets, _date, _time, _location);
    }

    function mint() public {
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getEvent(uint32 _id) public view returns (mainEvent memory) {
        return allEvents[_id];
    }
}
