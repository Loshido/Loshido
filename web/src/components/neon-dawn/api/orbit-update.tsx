export default () => <>
    <div class="heading">
        <h3>
            <span class="post method">POST</span>
            <code>/orbit/update</code>
        </h3>
        <p>
            Modifier le satellite en orbite.
        </p>
    </div>
    <hr />
    <div class="body">
        <h4>
            Corps de la requête
        </h4>
        <label for="update-name">
            <div class="meta">
                <code>name</code>
                <span class="type">string</span>
            </div>
            <p>
                Nouveau nom du satellite
            </p>
            <input type="text" id="update-name" placeholder="IE002"/>
        </label>
        <label for="update-color">
            <div class="meta">
                <code>color</code>
                <span class="type">[number, number, number]</span>
            </div>
            <p>
                Nouvelle couleur du satellite
            </p>
            <input type="color" id="update-color"/>
        </label>
        <button>
            Modifier
        </button>
    </div>
</>