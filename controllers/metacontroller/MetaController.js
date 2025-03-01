import { GetMetaHandler, getMetaIds, metaQueryGenerator, MetaResultIdValue } from "../../utils/metaControllerHelpers.js";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

const MetaController = async (AllProducts) => {
    try {
        // Extract metafield IDs from AllProducts (each product's metafields is an array)
        const metafieldIds = getMetaIds(AllProducts);
        
        // Generate the GraphQL query using the extracted IDs
        const metaQuery = metaQueryGenerator(metafieldIds);
        
        // Perform the API request and transform the result into an array of meta objects
        const metaResult = await MetaResultIdValue(metaQuery);
        
        // Update each product's metafields with the corresponding meta object's handle
        return AllProducts.map((obj) => {
            // If metafields is not an array, return the product unchanged
            if (!obj.metafields || !Array.isArray(obj.metafields)) {
                return obj;
            }

            return {
                ...obj,
                metafields: obj.metafields.map((metafield) => {
                    // Parse the metafield value if it's a string.
                    let parsedValue = metafield.value;
                    if (typeof parsedValue === "string") {
                        try {
                            parsedValue = JSON.parse(parsedValue);
                        } catch (error) {
                            // console.error("Error parsing metafield value2:", metafield.value);
                            // Optionally, you can choose to keep the string or set it to null.
                        }
                    }

                    // Determine the metavalue based on parsedValue.
                    // If parsedValue is an array, map each value to an object with a handle.
                    // Otherwise, use the single value.
                    const metavalue = Array.isArray(parsedValue)
                        ? parsedValue.map((val) => ({ handle: GetMetaHandler(metaResult, val) }))
                        : GetMetaHandler(metaResult, parsedValue);
                    return {
                        ...metafield,
                        metavalue,
                    };
                }),
            };
        });
    } catch (error) {
        console.error("Error fetching metaobjects:", error.response?.data || error.message);
        throw error;
    }
};

export default MetaController;
