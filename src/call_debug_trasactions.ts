import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const BLOCKCHAIN_URL = "https://polygon-mainnet.infura.io/v3/703cf583b7c6491fb813f1994e0560b5";

(async function () {
	const debugTransactionBody = (txHash: string) => {
		return {
			"jsonrpc": "2.0",
			"method": "debug_traceTransaction",
			"params": [txHash, {}],
			"id": 1,
		};
	}
	
	const transactions: string[] = JSON.parse(fs.readFileSync(path.join('./data', 'addresses.json'), 'utf8')).slice(0, 1);
	console.log(`start time is ${Date.now()}`);
	let count = 0;
	transactions.map(async (transaction) => {
		const res = await fetch(BLOCKCHAIN_URL, {
			method: 'POST',
			body: JSON.stringify(debugTransactionBody(transaction)),
		});
		const data = (await res.json()) as any;
		if (!data.error) {
			count += 1;
			console.log(Date.now());
		}
	});
	console.log(`Total success ${count}`);
})()
