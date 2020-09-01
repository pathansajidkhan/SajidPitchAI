import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'


const config = {
    accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    accessible: ACCESSIBLE.WHEN_UNLOCKED,
    authenticationPrompt: 'Authenticate yourself',
    service: 'example',
    authenticateType: AUTHENTICATION_TYPE.BIOMETRICS,
  }


/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
    try {
      return await SecureStorage.getItem(key, config)
    } catch {
      // not sure why this would fail... even reading the RN docs I'm unclear
      return null
    }
  }


/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
    try {
        await SecureStorage.setItem(key, value, config)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Loads something from storage and runs it thru JSON.parse.
   *
   * @param key The key to fetch.
   */
  export async function load(key: string): Promise<any | null> {
    try {
      const almostThere = await SecureStorage.getItem(key, config)
      return JSON.parse(almostThere)
    } catch {
      return null
    }
  }
  
  /**
   * Saves an object to storage.
   *
   * @param key The key to fetch.
   * @param value The value to store.
   */
  export async function save(key: string, value: any): Promise<boolean> {
    try {
      await SecureStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Removes something from storage.
   *
   * @param key The key to kill.
   */
  export async function remove(key: string): Promise<void> {
    try {
      await SecureStorage.removeItem(key)
    } catch {}
  }
  
  /**
   * Burn it all to the ground.
   */
  export async function clear(): Promise<void> {
    try {
      await SecureStorage.clear()
    } catch {}
  }
  
