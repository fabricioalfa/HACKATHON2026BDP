// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CreditCertificate is AccessControl {
    enum CertificateStatus {
        Pending,
        Issued,
        Revoked
    }

    bytes32 public constant OFFICER_ROLE = keccak256("OFFICER_ROLE");

    struct Certificate {
        uint256 id;
        address holder;
        bytes32 documentHash;
        string metadataURI;
        CertificateStatus status;
        uint256 createdAt;
        uint256 revokedAt;
        address issuer;
    }

    uint256 private _nextId = 1;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => bool) public isOfficer;

    event CertificateIssued(uint256 indexed id, address indexed holder, bytes32 documentHash, address indexed issuer, uint256 createdAt);
    event CertificateRevoked(uint256 indexed id, address indexed holder, address indexed revoker, uint256 revokedAt);

    modifier onlyOfficer() {
        require(hasRole(OFFICER_ROLE, msg.sender) || isOfficer[msg.sender], "Caller is not an officer");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OFFICER_ROLE, msg.sender);
    }

    function addOfficer(address officer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(OFFICER_ROLE, officer);
        isOfficer[officer] = true;
    }

    function removeOfficer(address officer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(OFFICER_ROLE, officer);
        isOfficer[officer] = false;
    }

    function issueCertificate(
        address holder,
        bytes32 documentHash,
        string memory metadataURI
    ) external onlyOfficer returns (uint256) {
        uint256 id = _nextId++;

        certificates[id] = Certificate({
            id: id,
            holder: holder,
            documentHash: documentHash,
            metadataURI: metadataURI,
            status: CertificateStatus.Issued,
            createdAt: block.timestamp,
            revokedAt: 0,
            issuer: msg.sender
        });

        emit CertificateIssued(id, holder, documentHash, msg.sender, block.timestamp);
        return id;
    }

    function revokeCertificate(uint256 id) external onlyOfficer {
        require(certificates[id].id != 0, "Certificate does not exist");
        Certificate storage cert = certificates[id];
        require(cert.status == CertificateStatus.Issued, "Certificate not issued");

        cert.status = CertificateStatus.Revoked;
        cert.revokedAt = block.timestamp;

        emit CertificateRevoked(id, cert.holder, msg.sender, block.timestamp);
    }

    function validateCertificate(uint256 id) external view returns (bool exists, CertificateStatus status, address holder, uint256 timestamp) {
        if (certificates[id].id == 0) {
            return (false, CertificateStatus.Pending, address(0), 0);
        }
        Certificate memory cert = certificates[id];
        return (true, cert.status, cert.holder, cert.createdAt);
    }

    function getCertificate(uint256 id) external view returns (Certificate memory) {
        require(certificates[id].id != 0, "Certificate does not exist");
        return certificates[id];
    }

    function _certificateIds() external view returns (uint256) {
        return _nextId;
    }
}
