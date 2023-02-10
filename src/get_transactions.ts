const TOTAL_TRANSACTION = 10;
const BLOCKCHAIN_URL = "https://polygon-mainnet.infura.io/v3/703cf583b7c6491fb813f1994e0560b5";
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

(async function main() {
	const blockBody = (blockNumber: number | string) => 
	{
		const blockNumberStr = '0x' + blockNumber.toString(16);
		return {
		"jsonrpc": "2.0",
		"method": "eth_getBlockByNumber",
		"params": [blockNumber === "latest" ? "latest" : blockNumberStr, false],
		"id": 1,
		}
	}
	const latestBlockResponse = await fetch(BLOCKCHAIN_URL, {
		method: 'POST',
		body: JSON.stringify(blockBody("latest"))
	});
	const latestBlock = await latestBlockResponse.json() as any;
	const latestBlockNumber = parseInt(latestBlock.result.number, 16);
	console.log(latestBlockNumber);

	let endBlock = latestBlockNumber - 3;
	let totalTransactions: string[] = [];
	while (endBlock) {
		const blockResponse = await fetch(BLOCKCHAIN_URL, { method: 'POST', body: JSON.stringify(blockBody(endBlock)) });
		const block = await blockResponse.json() as any;
		const blockTransactions = block.result.transactions;
		totalTransactions = totalTransactions.concat(...blockTransactions);
		if (totalTransactions.length > TOTAL_TRANSACTION) break;
		endBlock -= 1;
	}
	fs.writeFileSync(path.join('./data', 'addresses.json'), JSON.stringify(totalTransactions), 'utf8');
})();
