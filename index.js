const { createServer } = require('node:http');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'locar',
    port: '3306',
});


const handleRequests = (request, response) => {
    const { url, method } = request;
    if (url === '/veiculos.json' && method === 'GET') {
        connection.query('select * from veiculo', (err, results, fields) => {
            response.writeHeader(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify(results));
        })
    } else if (url === '/veiculos' && method === 'GET') {
        connection.query('select * from veiculo', (err, results, fields) => {
            response.writeHeader(200, {"Content-Type": "text/html"});
            console.log(results);
            const tableRows = results.map(({ id, modelo, placa }) => `
                <tr>
                    <td>${id}</td>
                    <td>${modelo}</td>
                    <td>${placa}</td>
                </tr>
            `).join('');

            response.write(`
                <table>
                 ${tableRows}
                </table>
                <a href="/novo">Cadastrar Novo</a>
            `);
            response.end();
        })
    } else if(url === '/novo' && method === 'GET') {
        connection.query('insert into veiculo (placa, modelo) value (\'HUY0980\', \'Fusca 1300\')', (err, results, fields) => {
            response.end('Acho que deu certo');
        });
    } else {
        response.writeHeader(404, {"Content-Type": "text/html"});
        response.write('<h1>Pagina nao encontrada</h1>');
        response.end();
    }

}

const server = createServer(handleRequests);

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`

