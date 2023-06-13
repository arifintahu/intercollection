class Request {
  private queryToPath(query: Object | undefined): string {
    if (query === undefined) {
      return ''
    }

    const keys = Object.keys(query)

    if (!keys.length) {
      return ''
    }

    let path = ''
    for (const key of keys) {
      if (path === '') {
        path = path + `?${key}=${query[key as keyof Object]}`
      } else {
        path = path + `&${key}=${query[key as keyof Object]}`
      }
    }

    return path
  }

  public async get(
    baseUrl: string,
    path: string,
    query?: Object
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(baseUrl + path + this.queryToPath(query), {
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
