from google.cloud import storage

storage_client = storage.Client.from_service_account_json('./project/credential/bold-gravity-235903-948d4887dbb0.json')
bucket_name = "9900proj"


def upload_blob(source_file_name, destination_blob_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)

    print(
        "File {} uploaded to {}.".format(
            source_file_name, destination_blob_name
        )
    )
