
const getServers = (selectedVmtas)=> {
    let serverIds = [];

    for (let i = 0; i < selectedVmtas.length; i++) {
        let [server_id,] = selectedVmtas[i].split('|').map(Number);
        
        if (serverIds.indexOf(server_id) == -1) {
            serverIds.push(server_id)
        }
        
    }
    return serverIds;

}
console.log(getServers([
    '2|20', '2|27', '2|13',
    '2|28', '2|15', '2|16',
    '2|17', '3|21', '3|22',
    '3|23', '3|24', '3|25',
    '2|18', '2|19', '2|11',
    '2|12'
  ]))