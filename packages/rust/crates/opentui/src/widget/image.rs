use super::{Behavior, Element, build, handle};
use crate::app::App;
use crate::error::Result;
use crate::native::{IMAGE_OPACITY_INHERIT, Image, ImageFit, ImageProtocol, NodeKind};
use std::cell::{Cell, RefCell};
use std::rc::Rc;

pub(crate) struct ImageInner {
    element: Element,
    image: RefCell<Option<Image>>,
    fit: Cell<ImageFit>,
    protocol: Cell<ImageProtocol>,
    placement_opacity: Cell<Option<f32>>,
}

impl ImageInner {
    fn publish(&self) {
        let image = self.image.borrow().clone();
        let (fit, protocol) = (self.fit.get(), self.protocol.get());
        let opacity = self.placement_opacity.get();
        self.element.apply(|node| {
            node.set_image_with_opacity(image.as_ref(), fit, protocol, opacity.unwrap_or(IMAGE_OPACITY_INHERIT))
        });
    }
}

impl Behavior for ImageInner {
    fn element(&self) -> &Element {
        &self.element
    }
}

/// A picture, drawn with the Kitty graphics protocol, Sixel, or half blocks, whichever the terminal supports best.
///
/// Give it a size; the image scales into it as [`Self::fit`] says.
///
/// ```no_run
/// # use opentui::prelude::*;
/// # use opentui::widget::ImageView;
/// # let app = App::new(AppOptions::default())?;
/// let logo = ImageView::new(&app).size(20, 10);
/// logo.load(&std::fs::read("logo.png")?)?;
/// # Ok::<(), Box<dyn std::error::Error>>(())
/// ```
#[derive(Clone)]
pub struct ImageView(Rc<ImageInner>);

handle!(ImageView, ImageInner);

impl ImageView {
    pub fn new(app: &App) -> Self {
        Self(build(app, NodeKind::Image, |element| ImageInner {
            element,
            image: RefCell::new(None),
            fit: Cell::new(ImageFit::Contain),
            protocol: Cell::new(ImageProtocol::Auto),
            placement_opacity: Cell::new(None),
        }))
    }

    /// Decodes PNG, JPEG, WebP, or GIF bytes and shows the image.
    pub fn load(&self, bytes: &[u8]) -> Result<Self> {
        let context = self.0.element.app().map(|app| app.session().context().clone());
        let Some(context) = context else { return Ok(self.clone()) };
        let image = Image::decode(&context, bytes)?;
        Ok(self.image(Some(image)))
    }

    /// Shows a decoded image, or nothing.
    pub fn image(&self, image: Option<Image>) -> Self {
        *self.0.image.borrow_mut() = image;
        self.0.publish();
        self.clone()
    }

    pub fn fit(&self, fit: ImageFit) -> Self {
        self.0.fit.set(fit);
        self.0.publish();
        self.clone()
    }

    /// Forces a protocol, for example [`ImageProtocol::Blocks`] for terminals that misreport graphics support.
    pub fn protocol(&self, protocol: ImageProtocol) -> Self {
        self.0.protocol.set(protocol);
        self.0.publish();
        self.clone()
    }

    /// Overrides the opacity of this image's placements (tfm fork).
    ///
    /// `None` inherits the render-tree opacity — the default. `Some(value)`
    /// replaces it with `value` (`0.0..=1.0`), so the image can stay opaque
    /// (or fade independently) under a node-opacity dim.
    ///
    /// # Panics
    ///
    /// Panics when `value` is outside `0.0..=1.0`.
    pub fn placement_opacity(&self, value: Option<f32>) -> Self {
        if let Some(value) = value {
            assert!((0.0..=1.0).contains(&value), "placement opacity must be within 0..1");
        }
        self.0.placement_opacity.set(value);
        self.0.publish();
        self.clone()
    }
}
