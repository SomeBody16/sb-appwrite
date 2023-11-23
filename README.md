# sb-appwrite

Used with AppWrite Functions

## Usage

### Bun

```typescript
import { Appwrite } from 'sb-appwrite'

class Function extends Appwrite {
  handler(): Promise<Record<string, any>> {

    const userApi = this.user
    const adminApi = this.admin

    return {
        hello: 'world',
    } 
  }
}

export default new Function()
```
