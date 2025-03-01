import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const API_URL = "https://4bz4tg-qg.myshopify.com/api/2024-10/graphql.json";
const API_TOKEN = process.env.SHOPIFY_API_TOKEN;

if (!API_TOKEN) {
    throw new Error("Missing SHOPIFY_API_TOKEN in environment variables.");
}

const getMetaIds = (AllProducts) => {
    if (!Array.isArray(AllProducts)) return []; // Ensure AllProducts is an array

    const metafieldIds = new Set(
        AllProducts.flatMap((productObj) => {
            if (!Array.isArray(productObj?.metafields)) return []; // Ensure metafields is an array

            return productObj.metafields.flatMap((metafield) => {
                let metaValues = metafield?.value;

                // Case 1: If already an array, return as-is
                if (Array.isArray(metaValues)) {
                    return metaValues;
                }

                // Case 2: If it's a string, try to parse it as JSON
                if (typeof metaValues === "string") {
                    try {
                        const parsedValue = JSON.parse(metaValues);
                        return Array.isArray(parsedValue) ? parsedValue : [parsedValue]; // Ensure array format
                    } catch (error) {
                        // console.error("Error parsing metafield value:", metaValues);
                        return []; // Skip invalid JSON values
                    }
                }

                // Case 3: If it's an object, extract values
                if (typeof metaValues === "object" && metaValues !== null) {
                    return Object.values(metaValues);
                }

                // Case 4: If it's a primitive value (string, number), wrap in array
                return metaValues ? [metaValues] : [];
            });
        })
    );

    return [...metafieldIds];
};

const metaQueryGenerator = (metafieldIds) => {
    if (!Array.isArray(metafieldIds) || metafieldIds.length === 0) {
        return { query: "query GetMetaobjects { }" }; // Empty query to avoid errors
    }

    // Filter out invalid IDs
    const validMetafieldIds = metafieldIds.filter(id => typeof id === "string" && id.startsWith("gid://shopify/Metaobject/"));

    if (validMetafieldIds.length === 0) {
        return { query: "query GetMetaobjects { }" }; // Avoid malformed queries
    }

    const query = validMetafieldIds.map((metaId, index) => 
        `metaobject${index + 1}: metaobject(id: "${metaId}") { id handle }`
    ).join(",");

    return {
        query: `query GetMetaobjects { ${query} }`
    };
};

const transformMetaObjects = (metaObjects) => {
    if (!metaObjects || typeof metaObjects !== "object") return []; // Ensure it's an object

    return Object.values(metaObjects)
        .filter(obj => obj?.id && obj?.handle) // Ensure valid id & handle
        .map(({ id, handle }) => ({ id, handle }));
};

const MetaResultIdValue = async (query) => {
    try {
        const response = await axios.post(API_URL, query, {
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": API_TOKEN,
            },
        });

        if (!response.data || !response.data.data) {
            console.error("Error: Empty response from Shopify API", response.data);
            return [];
        }
        return transformMetaObjects(response.data.data);
    } catch (error) {
        console.error("Error fetching metaobjects:", error.response?.data || error.message);
        return []; // Return an empty array to prevent undefined errors
    }
};

const GetMetaHandler = (metaResult, id) => {
    if (!Array.isArray(metaResult) || !id) return null;

    const foundMeta = metaResult.find(metaObject => metaObject.id === id);
    return foundMeta ? foundMeta.handle : null;
};

export { getMetaIds, metaQueryGenerator, MetaResultIdValue, GetMetaHandler };
