// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint64 public eventId;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct mainEvent {
        uint64 id;
        string eventName;
        uint256 cost;
        uint32 tickets;
        string date;
        string time;
        string location;
    }
    mapping (uint64 => mainEvent) private allEvents; // id => mainEvent struct
    mapping (uint64 => mapping(address => bool)) public hasBought; // id => [msg.sender => boolean]
    mapping (uint64 => mapping(uint64 => address)) public seatTaken; // id => [seats => msg.sender]
    mapping (uint64 => uint64[]) seatsTaken; // id => [seats]

    modifier onlyOwner() {
        msg.sender == owner;
        _;
    }

    constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list (string memory _eventName, uint256 _cost, uint32 _tickets, string memory _date, string memory _time, string memory _location) public  onlyOwner {
        eventId++;
        allEvents[eventId] = mainEvent(eventId, _eventName, _cost, _tickets, _date, _time, _location);
    }

    function mint(uint64 _id, uint64 _seats) public payable {

        require(_id != 0);
        require(allEvents[_id].tickets > 0);
        require(msg.value >= allEvents[_id].cost);
        require(hasBought[_id][msg.sender] == false);
        require(seatTaken[_id][_seats] == address(0));

        allEvents[_id].tickets -= 1;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seats] = msg.sender;
        seatsTaken[_id].push(_seats);
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
    }

    function getEvent(uint32 _id) public view returns (mainEvent memory) {
        return allEvents[_id];
    }

    function withdraw() public onlyOwner {
        (bool sucess, ) = owner.call{ value: address(this).balance}("");
        require(sucess);
    }
}
