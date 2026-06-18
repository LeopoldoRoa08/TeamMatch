const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('clans').select('*').limit(1).then(res => {
    if (res.data && res.data.length > 0) {
      console.log(Object.keys(res.data[0]));
    } else if (res.error) {
      console.log(res.error);
    } else {
      console.log('No data, checking via insert trick...');
      supabase.from('clans').insert({}).then(err => console.log(err));
    }
  });
}