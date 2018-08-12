var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

let runPython = new Promise( (resolve, reject) => 
{
	const { spawn } = require('child_process');
	const py = spawn('python', ['script.py']);

	let stdout = "";
	py.stdout.on('data', (d) => {
		stdout += d;
		console.log(stdout);
	});

	py.stdout.on('end', () => {
		resolve(stdout);
	});
})

router.get('/', (req, res)=>{
	getData('http://localhost:3000/api/data')
		.then((data) => res.render('index', {title: "r/nba - OKC Thunder", data: data}));
	});

function getData(urlString){
	return new Promise(function (resolve, reject){
		fetch(urlString)
			.then(res => res.json())
			.then(data => resolve(data));
	});
}
   
router.get('/api/data', (req, res) => {
	runPython.then(function(fromRunpy) {
        res.json(fromRunpy.toString());
    });
})
    

module.exports = router;