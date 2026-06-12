import asyncio, base64, json, sys
from pathlib import Path
from sdk.tools.pd_vercel_token_auth import pd_vercel_token_auth_proxy_post

ROOT = Path("/work/projects/nexfit")
FILES = ["index.html", "styles.css", "app.js", "scroll.js",
         "assets/hero.jpg", "assets/thumb1.jpg", "assets/thumb2.jpg", "assets/motion.jpg",
         "assets/card1.jpg", "assets/card2.jpg", "assets/card3.jpg"]

async def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "preview"
    files = []
    for f in FILES:
        data = (ROOT / f).read_bytes()
        files.append({"file": f, "data": base64.b64encode(data).decode(), "encoding": "base64"})
    body = {"name": "nexfit", "project": "nexfit", "files": files,
            "projectSettings": {"framework": None}}
    if target == "production":
        body["target"] = "production"
    res = await pd_vercel_token_auth_proxy_post(
        url="https://api.vercel.com/v13/deployments",
        query_params={"teamId": "team_OQDfLNrhsVEdGmu0hP11iY8W"},
        json_body=body,
    )
    if isinstance(res, dict):
        print(json.dumps(res, default=str)[:3000])
    else:
        print(json.dumps(res, default=str)[:1500])

asyncio.run(main())
