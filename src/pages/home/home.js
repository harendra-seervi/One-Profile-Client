import { AtCoderAPI } from "@odanado/atcoder-api"
function home(){
    async function main() {
        const client = new AtCoderAPI()
    
        console.log(await client.userInfo("tourist"))
    }
    main();
    return (
        <div>
            <h1>User Editorials:-</h1>
        </div>
    );
}

export default home;