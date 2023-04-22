import axios from "axios";

/**
 * Tests if the resource at this location exists or not
 * @param resourceUrl
 */
export async function resourceExists(resourceUrl: string): Promise<boolean> {
   try {
      let response = await axios.head(resourceUrl,)
      return response.status != 404;
   } catch (ex) {
      console.log(ex);
      return false;  // no, it doesn't exist if there was an exception
   }
} // resourceExists