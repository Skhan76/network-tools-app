import axios from "axios";

export async function fetchWhoisData(domain: string) {
  try {
    const response = await axios.get(`https://whoisjson.com/api/v1/whois`, {
      params: {
        domain: domain,
      },
      timeout: 10000,
    });

    const data = response.data;
    return {
      registrar: data.registrar || "Unknown",
      createdDate: data.creation_date || "Unknown",
      expiryDate: data.expiration_date || "Unknown",
      updatedDate: data.updated_date || "Unknown",
      registrant: data.registrant_name || "Unknown",
    };
  } catch (error) {
    throw new Error(`Failed to fetch WHOIS data: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function fetchBGPData(query: string) {
  try {
    const response = await axios.get("https://bgp.tools/table.jsonl", {
      timeout: 15000,
      headers: {
        "User-Agent": "NetworkTools bgp.tools - network-tools-app",
      },
    });

    const lines = response.data.split("\n").filter((line: string) => line.trim());
    const results = [];

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (
          (query.includes("/") && entry.CIDR === query) ||
          (query.startsWith("AS") && entry.ASN === parseInt(query.substring(2))) ||
          entry.CIDR.includes(query) ||
          entry.ASN.toString().includes(query)
        ) {
          results.push({
            cidr: entry.CIDR,
            asn: entry.ASN,
            hits: entry.Hits || 0,
          });
          if (results.length >= 50) break;
        }
      } catch {
        continue;
      }
    }

    return results;
  } catch (error) {
    throw new Error(`Failed to fetch BGP data: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function checkWebsiteUptime(url: string) {
  try {
    const startTime = Date.now();
    const response = await axios.head(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        "User-Agent": "NetworkTools/1.0",
      },
    });
    const responseTime = Date.now() - startTime;

    return {
      statusCode: response.status,
      responseTime: responseTime,
      contentLength: parseInt(response.headers["content-length"] || "0"),
      contentType: response.headers["content-type"] || "Unknown",
      isOnline: response.status >= 200 && response.status < 500,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        responseTime: 0,
        contentLength: 0,
        contentType: error.response.headers["content-type"] || "Unknown",
        isOnline: false,
      };
    }
    throw new Error(`Failed to check website uptime: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
