var running_intervals = [];
async function connectBinanceChainWallet() {
  if (typeof  window.ethereum !== undefined) {
    //Open and connect web3 wallet
    await window.ethereum.enable()
    const provider = new ethers.getDefaultProvider("https://bsc-dataseed.binance.org/");
    let address = await window.ethereum.request({method: 'eth_requestAccounts'});
    //Address should be fetched here
    console.log("Address connected: "+address);
    let networkId = await provider.getNetwork();
    //We can verify connected chain here
    console.log("Network ID: "+networkId.chainId);
    //Allow signing with provided address. Address needs to be converted to string.
    let signer = await provider.getSigner(address.toString());
    await signer.getAddress().then(addy => {
      //If success we will be able to interact with smart-contracts.
      //Apply UI changes once connected
      let shortAddress = addy.substring(0, 6) + "..." + addy.substring(addy.length - 4);
      document.getElementById('wallet-address').innerHTML = "Wallet connected: "+shortAddress;
      document.getElementById('connect-wallet-btn').style.display = 'none';
      document.getElementById('wallet-address').style.display = 'block';
      document.getElementById('stake-container').style.display = 'block';
      document.getElementById('admin-container').style.display = 'block';
      //Open staking (Proof of Concept: If admin or moderator, admin section gets displayed, would need smart contract validation)
      document.getElementById("open-staking-btn").addEventListener("click", function() {
        document.getElementById("boost-staking-btn").disabled = false;
        document.getElementById('stake-button').disabled = false;
        document.getElementById("close-staking-btn").disabled = false;
        document.getElementById("open-staking-btn").disabled = true;
        //Info: https://github.com/VincentGarreau/particles.js/
        particlesJS("fuegos-artificiales", {"particles":{"number":{"value":100,"density":{"enable":false,"value_area":800}},"color":{"value":"#fdda02"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"http://wiki.lexisnexis.com/academic/images/f/fb/Itunes_podcast_icon_300.jpg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":4,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":3.1565905665290903,"direction":"top","random":false,"straight":true,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"grab"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":200,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});
        random_boost();
      });
      //Closes staking (Proof of Concept: If admin or moderator, admin section gets displayed, would need smart contract validation)
      document.getElementById("close-staking-btn").addEventListener("click", function() {
        document.getElementById("boost-staking-btn").disabled = true;
        document.getElementById("close-staking-btn").disabled = true;
        document.getElementById('stake-button').disabled = true;
        document.getElementById("open-staking-btn").disabled = false;
        document.getElementById('boost-staking-btn').style.display = 'inline-block';
        document.getElementById('stop-boost-staking-btn').style.display = 'none';
        //Delete background effect
        if(window.pJSDom.length > 0){
          window.pJSDom[0].pJS.fn.vendors.destroypJS();
        }
        window["pJSDom"] = [];
        if(running_intervals.length > 0){
          clearInterval(running_intervals[(running_intervals.length-1)]);
        }
      });
      document.getElementById("boost-staking-btn").addEventListener("click", function() {
        //Add background effect

        /*document.getElementById("boost-staking-btn").disabled = true;
        //document.getElementById('boost-staking-btn').style.display = 'none';
        //document.getElementById('stop-boost-staking-btn').style.display = 'inline-block';
        //document.getElementById("stop-boost-staking-btn").disabled = false;*/

        //Execute boost
        //Info: https://github.com/VincentGarreau/particles.js/
        if(window.pJSDom.length > 0){
          window.pJSDom[0].pJS.fn.vendors.destroypJS();
        }
        window["pJSDom"] = [];
        particlesJS("fuegos-artificiales", {"particles":{"number":{"value":100,"density":{"enable":false,"value_area":800}},"color":{"value":"#fdda02"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"http://wiki.lexisnexis.com/academic/images/f/fb/Itunes_podcast_icon_300.jpg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":4,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":3.1565905665290903,"direction":"top","random":false,"straight":true,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"grab"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":200,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});
        random_boost();
      });
      /*document.getElementById("stop-boost-staking-btn").addEventListener("click", function() {
        document.getElementById("boost-staking-btn").disabled = false;
        document.getElementById("stop-boost-staking-btn").disabled = true;
        document.getElementById('boost-staking-btn').style.display = 'inline-block';
        document.getElementById('stop-boost-staking-btn').style.display = 'none';
        //Delete background effect
        if(window.pJSDom.length > 0){
          window.pJSDom[0].pJS.fn.vendors.destroypJS();
        }
        window["pJSDom"] = [];
        if(running_intervals.length > 0){
          clearInterval(running_intervals[(running_intervals.length-1)]);
        }
      });*/
    });
  }
}
function random_boost(){
  //Reseteamos velocidad y staking delta
  window.pJSDom[0].pJS.particles.move.speed = 3;
  if(running_intervals.length > 0){
    clearInterval(running_intervals[(running_intervals.length-1)]);
  }
  // Genera una constante de tiempo igual a 5 minutos (en segundos)
  const tau = 300;
  // Genera una duración aleatoria entre 1 y 5 minutos (en segundos)
  const duration = Math.floor(Math.random() * (300 - 60 + 1)) + 60;
  // Inicia el contador de tiempo en 0
  let t = 0;
  // Inicia el setInterval para ejecutar la función de forma periódica
  running_intervals.push(setInterval(() => {
    // Calcula el valor de la función de decrecimiento exponencial
    const value = 100 * Math.exp(-t / tau);
    //console.log(`Tiempo transcurrido: ${t} segundos - Valor: ${value}`);
    document.getElementById('stakepower').innerHTML = "Delta: "+parseInt(value)+"%";
    // Incrementa el contador de tiempo
    t++;
    window.pJSDom[0].pJS.particles.move.speed = 3*(value/100);
    // Si el tiempo transcurrido es mayor o igual a la duración aleatoria, detiene el setInterval
    if (t >= duration) {
      clearInterval(running_intervals[(running_intervals.length-1)]);
      random_boost();
    }
  }, 1000)); // Ejecuta la función cada 1 segundo
}
