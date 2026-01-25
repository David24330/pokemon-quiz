import { setData } from "./state.js";

export async function loadGameData(regions = []) {
    const regionFetches = [];

    if (regions.length === 0) {
        regionFetches.push(
            fetch("data/region/kanto.json").then(r => r.json()),
            fetch("data/region/johto.json").then(r => r.json())
        );
    } else {
        regions.forEach(r => regionFetches.push(fetch(`data/region/${r}.json`).then(x => x.json())));
    }

    const [regionsData, typesData] = await Promise.all([
        Promise.all(regionFetches),
        fetch("data/types/types.json").then(r => r.json())
    ]);

    setData({
        Pokemons: regionsData.flatMap(r => r.Pokemons),
        Places: regionsData.flatMap(r => r.Places),
        Types: typesData.types
    });
}
