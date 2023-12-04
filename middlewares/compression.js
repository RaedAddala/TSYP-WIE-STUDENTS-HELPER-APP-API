import compression from "compression";

// Compression Filter callback function
const shouldCompress = (req, res) => {
  if (req.headers["x-no-compression"]) {
    // don't compress responses if this request header is present
    return false;
  }
  // fallback to standard compression
  return compression.filter(req, res);
};

const compressor = compression({
  filter: shouldCompress,
  threshold: 0,
  level: 9,
  memLevel: 9,
});
export default compressor;
