from google.cloud import storage

storage_client = storage.Client.from_service_account_json('./project/credential/bold-gravity-235903-948d4887dbb0.json')
bucket_name = "9900proj"
bucket = storage_client.bucket(bucket_name)


def upload_blob(destination_blob_name):
    source_file_name = destination_blob_name
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)

    print(
        "File {} uploaded to {}.".format(
            source_file_name, destination_blob_name
        )
    )


def download_blob(destination_file_name):
    source_blob_name = destination_file_name
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

    print(
        "Blob {} downloaded to {}.".format(
            source_blob_name, destination_file_name
        )
    )
