class Request {
  public async get(baseUrl: string, path: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(baseUrl + path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        reject('Request failed')
      }
      resolve(response.json())
    })
  }
}

const request = new Request()
export default request
