
# ================================================
# Script botched together from various sources
# on the Tensorflow website. For citations and
# licensing see the main README.md file for 
# deitytyper.
#
# 5-15-2020
# A CNN would have probably been better for this
# particular model, but this is baduibattles
# and I'm too lazy to code a CNN today.
# Besides, the brute-force approach has an 84%
# accuracy!
#
# 5-16-2020
# Welp it looks like it's time to learn how to
# implement a CNN...so much for thinking this
# was gonna be easy.
#
# 5-17-2020
# I can't believe it...IT WORKS! YESSSSSSSS!
# All I had to do was to properly preprocess the
# image and fix a off-by-one error in the labels
# BUT IT WORKS WOOHOO
# At this rate I'll be a data scientist in no
# time /s
# ================================================

import tensorflow.compat.v2 as tf
import tensorflow_datasets as tfds
from tensorflow import keras
import tensorflowjs as tfjs
import numpy as np
import matplotlib.pyplot as plt # Note: import not used, here so that we don't upset the ML Gods

tfds.disable_progress_bar()
tf.enable_v2_behavior()

(ds_train, ds_test), ds_info = tfds.load(
    'emnist',
    split=['train', 'test'],
    shuffle_files=True,
    as_supervised=True,
    with_info=True,
)

def normalize_img(image, label):
  return tf.cast(image, tf.float32) / 255.0, label

ds_train = ds_train.map(
    normalize_img, num_parallel_calls=tf.data.experimental.AUTOTUNE)
ds_train = ds_train.cache()
ds_train = ds_train.shuffle(ds_info.splits['train'].num_examples)
ds_train = ds_train.batch(256)
ds_train = ds_train.prefetch(tf.data.experimental.AUTOTUNE)

ds_test = ds_test.map(
    normalize_img, num_parallel_calls=tf.data.experimental.AUTOTUNE)
ds_test = ds_test.batch(256)
ds_test = ds_test.cache()
ds_test = ds_test.prefetch(tf.data.experimental.AUTOTUNE)

model = tf.keras.models.Sequential([
  tf.keras.layers.Conv2D(16, 3, activation='relu', input_shape=(28, 28, 1)),
  tf.keras.layers.MaxPooling2D((2, 2), 2),
  tf.keras.layers.Conv2D(32, 3, activation='relu'),
  tf.keras.layers.MaxPooling2D((2, 2), 2),
  tf.keras.layers.Conv2D(32, 3, activation='relu'),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(10, activation='relu'),
  tf.keras.layers.Dense(62, activation='softmax')
])

model.compile(
    loss='sparse_categorical_crossentropy',
    optimizer=tf.keras.optimizers.Adam(0.001),
    metrics=['accuracy'],
)

model.fit(
    ds_train,
    epochs=6,
    validation_data=ds_test,
)

tfjs.converters.save_keras_model(model, './')