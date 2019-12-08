const fs = require('fs')
const express = require('express');
const router = express.Router();
const Web3 = require('web3');

const bytecode = fs.readFileSync('./contracts_Voting_sol_Voting.bin').toString();
const abi = JSON.parse(fs.readFileSync('./contracts_Voting_sol_Voting.abi').toString());
const web3 = new Web3('http://localhost:8545');
let deployedContract = new web3.eth.Contract(abi);
const listOfCandidates = ['Rama', 'Nick', 'Jose'];

web3.eth.getAccounts().then(accounts => {
  return deployedContract.deploy({
    data: bytecode,
    arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
  }).send({
    from: accounts[0],
    gas: 1500000,
    gasPrice: web3.utils.toWei('0.00003', 'ether')
  })  
}).then(newContractInstance => {
  deployedContract.options.address = newContractInstance.options.address;
});

/* GET home page. */
router.get('/', async (req, res, next) => {
  const accounts = await web3.eth.getAccounts();

  const votes = await Promise.all(listOfCandidates.map(async name => await deployedContract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call()));
  const votesCount = listOfCandidates.reduce((obj, name, i) => {
    obj[name] = votes[i];
    return obj;
  }, {});
  res.render('index', { title: 'Express', votesCount, addresses: accounts.slice(1) });
});

router.post('/', async (req, res, next) => {
  const response = await deployedContract.methods.voteForCandidate(web3.utils.asciiToHex(req.body.candidateName)).send({
    from: req.body.address
  });
  res.send(response);
});

module.exports = router;
