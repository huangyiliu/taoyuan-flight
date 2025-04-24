export default async function handler(req, res) {
  const { flight } = req.query;
  if (!flight) {
    return res.status(400).json({ error: "缺少 flight 參數" });
  }

  const flightArray = Array.isArray(flight) ? flight : [flight];

  try {
    const response = await fetch("https://quality.data.gov.tw/dq_download_json.php?nid=140327&md5_url=65b4d4418c6e6c86e37a76a1b3e7e157");
    const data = await response.json();

    const today = new Date().toISOString().split("T")[0];

    const result = data
      .filter(item => flightArray.includes(item.FlightNo))
      .map(item => ({
        flightNo: item.FlightNo,
        depTime: item.TakeOffTime,
        status: item.Status
      }));

    return res.status(200).json({ date: today, flights: result });
  } catch (e) {
    return res.status(500).json({ error: "無法取得航班資料" });
  }
}
