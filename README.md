### Hello 👋
uBin serves as both a bundler and builder, utilizing the ESBuild technology concurrently.
### Usage
```javascript
{
	scripts: {
		
		"api_start": "ubin watch_api", - Development mode
		"api_build": "ubin build_api", - TS builder ( esbuild )
		"api_serve": "ubin serve_api", - Serve your endpoint

		"app_start": "ubin watch_app", - Development mode
		"app_build": "ubin build_app", - TSX bundler ( esbuild )
		"app_serve": "ubin serve_app", - Serve the static

	}
}
```
