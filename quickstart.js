const {DataLabelingServiceClient} = require('@google-cloud/datalabeling');
const client = new DataLabelingServiceClient();

async function quickstart() {
  const parent = client.projectPath(projectId);
  const [result] = await client.listDatasets({parent});
  console.log('Datasets:');
  console.log(result);
}
quickstart();