import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl  = "https://ypuwomlfyckfebawwlim.supabase.co";
const supabaseKey  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdXdvbWxmeWNrZmViYXd3bGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDI2OTEsImV4cCI6MjA4MDI3ODY5MX0.tpzoiJguGWn3Ld8rdI6xpVq5uxKe0sBwunStbzVHbDM";

const db = createClient(supabaseUrl, supabaseKey);

async function saveJob() {
  let name    = document.getElementById("name").value;
  let phone   = document.getElementById("phone").value;
  let service = document.getElementById("service").value;
  let price   = document.getElementById("price").value;

  const { data, error } = await db
    .from("jobs")
    .insert([
      {
        customer_name: name,
        phone: phone,
        service_type: service,
        price: price
      }
    ]);

  if (error) {
    alert("❌ Xogta lama kaydin — fadlan hubi console-ka.");
    console.error(error);
  } else {
    alert("✅ Xogta waa la kaydiyay!");
    console.log(data);
  }
}
