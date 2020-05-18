# DeityTyper
## May 2020

Welcome, our Lord, to the Hall of Origin. Except first you'll need to prove your identity.

Why don't you enter the passcode™ by moving the universe? Surely it can't be too hard for an omniscient being like you...

## Running

```
npm install && node index.js
```

## How it Works

As you drag around the window, each window location is saved to an array, which is then normalized and used to draw a 28x28 image.
That image is then flipped horizontally, rotated counterclockwise, and converted to a tensor with shape (28, 28, 1).
A pretrained CNN based on the EMNIST dataset then predicts the letter (a-zA-Z) or number (0-9) that has been drawn, and inserts that into the passcode field.

Passcode validation is done serverside, but you could just set `passwordValidated` to true on the client to produce the same effect.

This project was actually my first attempt at learning Tensorflow and contains my first Convolutional Neural Network!

## Training the Model

`model/main.py` contains the code used to train and export the model.
The model is a pretty standard CNN pulled off of various sources on the Tensorflow website and API.


If you want to train the model yourself, you'll need the [Poetry dependency manager](https://python-poetry.org/). Execute the following to setup and run the code:

```
poetry install
poetry run python main.py
```

Note that this may take a while to run, as the EMNIST dataset is quite large and takes a looong time to download and train. And I'm too lazy to setup a Jypter notebook today.

## Citations + Licensing

Cohen, G., Afshar, S., Tapson, J., & van Schaik, A. (2017). EMNIST: an extension of MNIST to handwritten letters. Retrieved from http://arxiv.org/abs/1702.05373

Some portions of this code contain modified snippets from https://www.tensorflow.org/, which were originally licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Significant changes from the original code include adjusted model layers and hyperparameters.