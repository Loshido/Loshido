export default () => <>
    <div class="heading">
        <h3>
            <span class="post method">POST</span>
            <code>/orbit/launch</code>
        </h3>
        <p>
            Lancer un satellite en orbite.
        </p>
    </div>
    <hr />
    <div class="body">
        <h4>
            Corps de la requête
        </h4>
        <label for="launch-name">
            <div class="meta">
                <code>name</code>
                <sup class="required">*</sup>
                <span class="type">string</span>
            </div>
            <p>
                Nom du satellite
            </p>
            <input type="text" id="launch-name" placeholder="IE001" checked/>
        </label>
        <label for="launch-color">
            <div class="meta">
                <code>color</code>
                <sup class="required">*</sup>
                <span class="type">[number, number, number]</span>
            </div>
            <p>
                Couleur du satellite
            </p>
            <input type="color" id="launch-color"/>
        </label>
        <label for="launch-payload">
            <div class="meta">
                <code>citation</code>
                <sup class="required">*</sup>
                <span class="type">string</span>
            </div>
            <p>
                Citation
            </p>
            <input type="text" id="launch-payload" placeholder="Vers l'infini et au delà"/>
        </label>
        <button id="launch-button">
            Lancement
        </button>
        {/* <script>
            const launch = document.getElementById('launch-button')
            const name = document.getElementById('launch-name')
            const color = document.getElementById('launch-color')
            const citation = document.getElementById('launch-payload'
            launch.addEventListener('click', async () => {
                if(name.value.length === 0) return
                if(citation.value.length === 0) retur
                const response = await fetch('.../orbit/launch', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: name.value,
                        citation: citation.value,
                        color: [
                            parseInt(color.value.slice(1, 3), 16),
                            parseInt(color.value.slice(3, 5), 16),
                            parseInt(color.value.slice(5, 7), 16),
                        ]
                    })
                }
                console.log(response)
            })
        </script> */}
    </div>
</>
